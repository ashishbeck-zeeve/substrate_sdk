import 'dart:async';

import 'package:substrate_sdk/src/webViewRunner.dart';

/// The service calling JavaScript API of `axia-js/api` directly
/// through [WebViewRunner], providing APIs for [SubstrateApi].
class SubstrateService {
  late ServiceBasic basic;

  late WebViewRunner _web;

  WebViewRunner get webView => _web;

  Future<void> init({
    WebViewRunner? webViewParam,
    required Function onInitiated,
    String? jsCode,
  }) async {
    basic = ServiceBasic(this);

    _web = webViewParam ?? WebViewRunner();
    await _web.launch(onInitiated, jsCode: jsCode);
  }
}

class ServiceBasic {
  ServiceBasic(this.serviceRoot);

  final SubstrateService serviceRoot;

  Future getWallet({required String mnemonic}) async {
    final res = await serviceRoot.webView.evalJavascript(
        // 'sign.newTest()');
        'basic.getWallet("$mnemonic")');
    return res;
  }

  Future<dynamic> signTransaction({
    String mnemonic =
        "earn opinion sketch humble turn unaware keep defy what clay tip tribe",
    String dest = "13KVzBiWfQz6NdB5QwUBNfqijsahgoWR3BzUEYGDRoaGbrjY",
    double amount = 500000000000, // 0.5 AXC
    bool submit = false,
    String unit = "AXC",
  }) async {
    final res = await serviceRoot.webView.evalJavascript(
        'basic.signTransaction("$mnemonic", "$dest", "${amount.toString()}", $submit, "$unit")');
    return res;
  }
}
