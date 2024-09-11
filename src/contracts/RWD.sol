// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RWD {
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint public totalSupply = 1000000000000000000000000;
    uint public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint value);
    event Approve(address indexed _owner, address indexed _spender, uint value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    // 0x3249jf908h => 5 ETH (0x3249jf908h : 5 ETH)
    // 0x3249jf908h => (0x5jfg124y7hf => 3 ETH) || [[]]
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to the zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value); // Генерация события Approval
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0), "Cannot transfer to the zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
