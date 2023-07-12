let ethereum = window.ethereum;
export async function personal_sign_eth(msg, from) {
	console.log(`sign msg `, msg, `from `, from, typeof msg)
	try {
		const msgBuff = `0x${Buffer.from(msg, 'utf8').toString('hex')}`;
		const sign = await ethereum.request({
			method: 'personal_sign',
			params: [msgBuff, from, 'Example password'],
		});
		return sign;
	} catch (err) {
		console.error('personal_sign_eth fail', err);
		throw err;
	}
}