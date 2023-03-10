const assert = require('assert');
const ganache = require('ganache-cli');
const mocha = require('mocha');
const Web3 = require('web3');
const { evm,abi } = require('../compile.js');
const provider = ganache.provider();
const web3 = new Web3(provider);

let lottery;
let accounts;

beforeEach(async()=>{
    accounts = await new web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(abi).deploy({data: evm.bytecode.object}).send({from:accounts[0], gas:1000000});
    provider.engine.stop();
})

describe('Lottery Contract',()=>{
    it('deploys contract',()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter',async ()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });

   

})