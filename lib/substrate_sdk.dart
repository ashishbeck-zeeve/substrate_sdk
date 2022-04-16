library substrate_sdk;

import 'dart:async';

import 'package:substrate_sdk/src/api.dart';
import 'package:substrate_sdk/src/service.dart';
import 'package:substrate_sdk/src/webViewRunner.dart';

export 'package:substrate_sdk/src/api.dart';
export 'package:substrate_sdk/src/service.dart';
export 'package:substrate_sdk/src/webViewRunner.dart';

class SubstrateSDK {
  SubstrateApi? api;

  late SubstrateService _service;

  /// webView instance, this is the only instance of FlutterWebViewPlugin
  /// in App, we need to get it and reuse in other sdk.
  WebViewRunner get webView => _service.webView;

  /// param [jsCode] is customized js code of parachain,
  /// the api works without [jsCode] param in AXIALunar/AXIA.
  Future<void> init({
    WebViewRunner? webView,
    String? jsCode,
  }) async {
    final c = Completer();

    _service = SubstrateService();
    await _service.init(
      webViewParam: webView,
      jsCode: jsCode,
      onInitiated: () {
        if (!c.isCompleted) {
          c.complete();
        }
      },
    );

    api = SubstrateApi(_service)..init();
    return c.future;
  }
}
