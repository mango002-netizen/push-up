import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DW8tokSB.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBoard = createServerFn({ method: "GET" }).handler(createSsrRpc("3b7eee93a4e69e29a61c0b6c91b331a3ef8d6d5e948a80574cd49e6ab1a6743b"));
var getHall = createServerFn({ method: "GET" }).handler(createSsrRpc("f99e897e2f1a11e595879b888e035b8cff95d3293348ca99959c58ba21ecfe50"));
createServerFn({ method: "GET" }).validator((d) => d).handler(createSsrRpc("d6efc0ddda07b986c9691db394df4e0b3a30ca9fa9a4a2f89c1617905d59179e"));
var createIntent = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("96392e9864ff476ae897b97d23a2f627a563f714a51061469015b03996be45fd"));
var getIntent = createServerFn({ method: "GET" }).validator((d) => d).handler(createSsrRpc("a708ae0d3631db7ed5e84707675856a974396006850cead03b08225d79c01196"));
var confirmPay = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("f734fd279e0e5ce2461dc9853f0f84f9e6fc88143282caf7241d2d6202ef436a"));
//#endregion
export { getIntent as a, getHall as i, createIntent as n, getBoard as r, confirmPay as t };
