function(properties, context) {

const wallet = require('@stacks/wallet-sdk');
    
    const transaction = require('@stacks/transactions');
    const fs = require('fs');
    
    const password = properties.password_input;
    const secretKey = properties.secret_key_input;
    const address = properties.post_condition_address;
    const ammount = properties.ammount;
    const contract_address = properties.contract_address;
    const contract_name = properties.contract_name;
    const function_name = properties.function_name;
    
    let create_wallet = context.async(async callback => {
        
        try{
          let new_wallet = await wallet.generateWallet({
              secretKey: secretKey,
              password: password
          });
          callback(null, new_wallet);
            
        }
        catch(err){
          callback(err);
      }});
    
    let restored_wallet = context.async(async callback => {
        
        try{
          	let accounts = await wallet.restoreWalletAccounts({
  				// `baseWallet` is returned from `generateWallet`
  				wallet: create_wallet,
  				gaiaHubUrl: 'https://hub.blockstack.org',
  				network: 'mainnet',
			});
           
          callback(null, accounts);
            
        }
        catch(err){
          callback(err);
      }});
        
    let privateKey = context.async(async callback => {
        
        try{
          	let pvtKey = await restored_wallet.accounts[0].stxPrivateKey;
           
          callback(null, pvtKey);
            
        }
        catch(err){
          callback(err);
      }});

    const postConditionAddress = address;
	const postConditionCode = transaction.FungibleConditionCode.GreaterEqual;
	const postConditionAmount = ammount;
	const postConditions = [
  		transaction.makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
	];
    
    
	const txOptions = {
  		contractAddress: contract_address,
  		contractName: contract_name,
  		functionName: function_name,
  		functionArgs: [transaction.bufferCVFromString('foo')],
  		senderKey: privateKey,
  		validateWithAbi: true,
  		network: 'mainnet',
  		postConditions,
  		anchorMode: transaction.AnchorMode.Any,
	};
    
    let trans = context.async(async callback => {
        
        try{
          let TransactionToken = await transaction.makeContractCall(txOptions);
          callback(null, TransactionToken);
            
        }
        catch(err){
          callback(err);
      }});
    
    let broadcastResponse = context.async(async callback => {
        
        try{
          let broad = await transaction.broadcastTransaction(trans,'mainnet');
          callback(null, broad);
            
        }
        catch(err){
          callback(err);
      }});
    
	const txId = broadcastResponse.txid; 
    
    return {
        broadcast_response: txId
    }



}