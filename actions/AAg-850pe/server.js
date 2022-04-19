function(properties, context) {
    const wallet = require('@stacks/wallet-sdk');
    const transaction = require('@stacks/transactions');
    
    const password = properties.password_input;
    const secretKey = properties.secret_key_input;
    const recipient = properties.recipient;
    let amount = properties.amount;
    const memo = properties.memo;
    
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
    
	//let a = restored_wallet.accounts[0].stxPrivateKey;
    
    let privateKey = context.async(async callback => {
        
        try{
          	let pvtKey = await restored_wallet.accounts[0].stxPrivateKey;
           
          callback(null, pvtKey);
            
        }
        catch(err){
          callback(err);
      }});
    
    
    
	// Get public key from private
	//const publicKey = transaction.getPublicKey(privateKey);
    
    
    
    const txOptions = {
  		recipient: recipient,
  		amount: amount,
  		senderKey: privateKey,
  		network: 'mainnet', // for mainnet, use 'mainnet'
  		memo: memo,
  		nonce: 0n, // set a nonce manually if you don't want builder to fetch from a Stacks node
  		fee: 200n, // set a tx fee if you don't want the builder to estimate
  		anchorMode: transaction.AnchorMode.Any,
	};

	
    let trans = context.async(async callback => {
        
        try{
          let TransactionToken = await transaction.makeSTXTokenTransfer(txOptions);
          callback(null, TransactionToken);
            
        }
        catch(err){
          callback(err);
      }});
    
	
	// to see the raw serialized tx
	const serializedTx = trans.serialize().toString('hex');

	// broadcasting transaction to the specified network
    let broadcastResponse = context.async(async callback => {
        
        try{
          let broad = await transaction.broadcastTransaction(trans);
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