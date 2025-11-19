// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Betting {
    enum MarketStatus { Open, Settled, Voided }

    struct Market {
        uint256 id;
        string sport;
        string teamA;
        string teamB;
        uint256 cutoffTime;
        uint8 winningTeam;
        MarketStatus status;
        uint256 totalPoolTeamA;
        uint256 totalPoolTeamB;
    }

    address public owner;
    uint256 public nextMarketId;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public betsTeamA;
    mapping(uint256 => mapping(address => uint256)) public betsTeamB;
    mapping(uint256 => mapping(address => bool)) public claimed;

    event MarketCreated(uint256 indexed marketId, string sport, string teamA, string teamB, uint256 cutoffTime);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, uint8 team, uint256 amount);
    event MarketSettled(uint256 indexed marketId, uint8 winningTeam);
    event MarketVoided(uint256 indexed marketId);
    event WinningsClaimed(uint256 indexed marketId, address indexed bettor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier marketExists(uint256 _marketId) {
        require(_marketId < nextMarketId, "Market does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(
        string memory _sport,
        string memory _teamA,
        string memory _teamB,
        uint256 _cutoffTime
    ) external onlyOwner {
        require(_cutoffTime > block.timestamp, "Cutoff must be in future");
        uint256 marketId = nextMarketId;
        markets[marketId] = Market({
            id: marketId,
            sport: _sport,
            teamA: _teamA,
            teamB: _teamB,
            cutoffTime: _cutoffTime,
            winningTeam: 0,
            status: MarketStatus.Open,
            totalPoolTeamA: 0,
            totalPoolTeamB: 0
        });
        nextMarketId++;
        emit MarketCreated(marketId, _sport, _teamA, _teamB, _cutoffTime);
    }

    function placeBet(uint256 _marketId, uint8 _team)
        external
        payable
        marketExists(_marketId)
    {
        Market storage m = markets[_marketId];
        require(m.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < m.cutoffTime, "Betting closed");
        require(msg.value > 0, "No ETH sent");
        require(_team == 1 || _team == 2, "Invalid team");
        if (_team == 1) {
            betsTeamA[_marketId][msg.sender] += msg.value;
            m.totalPoolTeamA += msg.value;
        } else {
            betsTeamB[_marketId][msg.sender] += msg.value;
            m.totalPoolTeamB += msg.value;
        }
        emit BetPlaced(_marketId, msg.sender, _team, msg.value);
    }

    function settleMarket(uint256 _marketId, uint8 _winningTeam)
        external
        onlyOwner
        marketExists(_marketId)
    {
        Market storage m = markets[_marketId];
        require(m.status == MarketStatus.Open, "Already settled/voided");
        require(_winningTeam == 1 || _winningTeam == 2, "Invalid winning team");
        m.winningTeam = _winningTeam;
        m.status = MarketStatus.Settled;
        emit MarketSettled(_marketId, _winningTeam);
    }

    function voidMarket(uint256 _marketId)
        external
        onlyOwner
        marketExists(_marketId)
    {
        Market storage m = markets[_marketId];
        require(m.status == MarketStatus.Open, "Not open");
        m.status = MarketStatus.Voided;
        emit MarketVoided(_marketId);
    }

    function claim(uint256 _marketId) external marketExists(_marketId) {
        Market storage m = markets[_marketId];
        require(m.status == MarketStatus.Settled, "Not settled");
        require(!claimed[_marketId][msg.sender], "Already claimed");
        uint256 userBet;
        uint256 winningPool;
        uint256 losingPool;
        if (m.winningTeam == 1) {
            userBet = betsTeamA[_marketId][msg.sender];
            winningPool = m.totalPoolTeamA;
            losingPool = m.totalPoolTeamB;
        } else {
            userBet = betsTeamB[_marketId][msg.sender];
            winningPool = m.totalPoolTeamB;
            losingPool = m.totalPoolTeamA;
        }
        require(userBet > 0, "No winning bet");
        uint256 payout = userBet + (losingPool * userBet) / winningPool;
        claimed[_marketId][msg.sender] = true;
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");
        emit WinningsClaimed(_marketId, msg.sender, payout);
    }

    function refund(uint256 _marketId) external marketExists(_marketId) {
        Market storage m = markets[_marketId];
        require(m.status == MarketStatus.Voided, "Not voided");
        require(!claimed[_marketId][msg.sender], "Already refunded");
        uint256 amount = betsTeamA[_marketId][msg.sender] + betsTeamB[_marketId][msg.sender];
        require(amount > 0, "Nothing to refund");
        claimed[_marketId][msg.sender] = true;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");
    }

    function getMarket(uint256 _marketId)
        external
        view
        marketExists(_marketId)
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint8,
            MarketStatus,
            uint256,
            uint256
        )
    {
        Market memory m = markets[_marketId];
        return (
            m.sport,
            m.teamA,
            m.teamB,
            m.cutoffTime,
            m.winningTeam,
            m.status,
            m.totalPoolTeamA,
            m.totalPoolTeamB
        );
    }

    function getUserStake(uint256 _marketId, address _user)
        external
        view
        returns (uint256 stakeA, uint256 stakeB)
    {
        stakeA = betsTeamA[_marketId][_user];
        stakeB = betsTeamB[_marketId][_user];
    }
}

