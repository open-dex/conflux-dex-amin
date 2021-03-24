class ConfluxPortal {
  constructor (conflux) {
    if (typeof conflux === 'undefined') {
      //throw new Error('No Conflux detected')
      // throwing Error will raise webpack error.
      return
    }
    if (!conflux.isConfluxPortal) {
      console.debug('Unknown Conflux.')
    }
    this.conflux = conflux
  }

  async enable () {
    this.accounts = await this.conflux.enable()
  }

  getAccount () {
    if (!this.accounts) {
      throw new Error('Please enable Conflux Portal first')
    }
    return this.accounts[0]
  }
  // https://conflux-portal-docs.conflux-chain.org/docs/portal/API_Reference/signing_data_with_portal
  // https://github.com/Conflux-Chain/conflux-portal/blob/develop/test/e2e/contract-test/contract.js
  requestCfxSign(data, addr) {
    console.info('try sign, addr is ', addr, 'data str is ', data);
    return new Promise( (resolve, reject)=> {
      this.conflux.sendAsync({
            method: 'cfx_sign',
            params: [
              addr,
              // keccak256.digest(data),
              data
            ],
            from: addr,
          },
          (err, result) => {
            console.info('portal sign return ', err, result);
            if (err) {
              // console.info('portal error');
              reject(err)
            } else {
              // console.info('portal resolve', resolve);
              resolve(result)
            }
          }
      );
    });
    }
  requestPersonalSign(data, addr, resolve, reject) {
    console.info('try sign, addr is ', addr, 'data str is ', data);
    this.conflux.sendAsync({
          method: 'personal_sign',
          params: [data, addr],
          from: addr,
        },
        (err, result) => {
          console.info('portal sign return ', err, result);
          if (err) {
            // console.info('portal error');
            reject(err)
          } else {
            // console.info('portal resolve', resolve);
            resolve(result)
          }
        }
    );
  }
  requestSign(typedData, addr, resolve, reject) {

    //
    const jsonStr = JSON.stringify(typedData);
    console.info('try sign, addr is ', addr, 'json str is ', jsonStr);
      this.conflux.sendAsync({
            method: 'cfx_signTypedData_v4',
            params: [addr, jsonStr],
            from: addr,
          },
          (err, result) => {
            console.info('portal sign return ', err, result);
            if (err) {
              // console.info('portal error');
              reject(err)
            } else {
              // console.info('portal resolve', resolve);
              resolve(result)
            }
          }
      );
  }

  async sendTransaction (params) {
    return new Promise((resolve, reject) => {
      this.conflux.sendAsync({
        method: 'cfx_sendTransaction',
        params: [params],
        from: params.from,
        gasPrice: '0x09184e72a000', // customizable by user during ConfluxPortal confirmation.
        gas: '0x2710',  // customizable by user during ConfluxPortal confirmation.
        value: '0x00',
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

export default new ConfluxPortal(window.conflux)
