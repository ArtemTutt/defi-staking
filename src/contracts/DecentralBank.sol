// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
  address public owner;
  string public name = "Decentral Bank";
  Tether public tether;
  RWD public rwd;

  constructor(RWD _rwd, Tether _tether) {
    rwd = _rwd;
    tether = _tether;
  }

  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaked;
  mapping(address => uint) public rewardBalance;
  address[] public stakers;

  function stakingTokens(uint _amount) public {

    require(_amount > 0, "amount cannot be 0");
    
    tether.transferFrom(msg.sender, address(this), _amount);

    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    
    {/*
      Если инвестор занес ликвидность в проект, мы сраза добавляем его в массив со стейкерами
    */}
    if(!hasStaked[msg.sender]) { 
      stakers.push(msg.sender);  
    }

    isStaked[msg.sender] = true;
    hasStaked[msg.sender] = true;
    tokenDistribution();
  }

  // TOKEN DISTRIBUTION SYSTEM (моя реализация)
  // function issueTokens() public {
  //   // prompt к gpt: распределение токенов раз в сутки (после стейкинга брать timestamp и раз в 24 часа начислять токены стейкеру)
  //   // (варинат проще) - сделать как обычнй обменик 1 к 1
  //   {/*
  //     При начале стейкинга, будет происходить отсчет времени и каждые 24 часа, ревард токеты будут капать на баланс
  //   */}
  //   if (hasStaked[msg.sender] == true) {
  //     rewardBalance[msg.sender] += 10; 
  //   }
    
  // }

  function issueTokens() public {
   // reuire the owner to issue tokens only
   //  require(msg.sender == owner, "caller must be the owner");

   // 
   for(uint i = 0; i < stakers.length; i++) {
    address recipient = stakers[i];
    uint balance = stakingBalance[recipient] / 9;
    if (balance > 0) {
      rwd.transfer(recipient, balance);
    }
   }
  }

  function tokenDistribution() public {
    if (hasStaked[msg.sender] == true) {
      rewardBalance[msg.sender] += stakingBalance[msg.sender] / 9;
    }
  }


  function deleteStakers(address _stakers) public  {
    for (uint256 i = 0; i < stakers.length; i++) {
      if (stakers[i] == _stakers) {
        // Перемещаем последний элемент на место удаляемого
        stakers[i] = stakers[stakers.length - 1];
        // Удаляем последний элемент
        stakers.pop();
        break; // Выходим из цикла после удаления
      }
    }
  }

  function unStakingTokens(uint _amount) public {
    require(_amount <= stakingBalance[msg.sender], "You cannot unstake more then you stake");

    tether.transfer(msg.sender, _amount);

    stakingBalance[msg.sender] = stakingBalance[msg.sender] - _amount;

    if (stakingBalance[msg.sender] == 0) {
      isStaked[msg.sender] = false;
      hasStaked[msg.sender] = false;
      deleteStakers(msg.sender);
    }

  }


  function unStakingTokensAll() public {
    // require(_amount <= stakingBalance[msg.sender], "You cannot unstake more then you stake");
    uint balance = stakingBalance[msg.sender];

    // address payable _to = payable(msg.sender);
    // tether.transferFrom(address(this), msg.sender, _amount);
    tether.transfer(msg.sender, balance);

    stakingBalance[msg.sender] = 0;

    {/*
      Если инвестор вывел все средства со стейкинга, тогда мы удаляем его со стейкеров
    */}
    isStaked[msg.sender] = false;
    hasStaked[msg.sender] = false;
    deleteStakers(msg.sender);
  }
}
