import 'dart:convert';

import 'package:substrate_sdk/src/service.dart';

class SubstrateApi {
  SubstrateApi(this.service);

  final SubstrateService service;

  late ApiBasic basic;

  void init() {
    basic = ApiBasic(this, service.basic);
  }

  /// subscribe message.
  Future<void> subscribeMessage(
    String JSCall,
    List params,
    String channel,
    Function callback,
  ) async {
    service.webView.subscribeMessage(
      'settings.subscribeMessage($JSCall, ${jsonEncode(params)}, "$channel")',
      channel,
      callback,
    );
  }

  /// unsubscribe message.
  void unsubscribeMessage(String channel) {
    service.webView.unsubscribeMessage(channel);
  }
}

class ApiBasic {
  ApiBasic(this.apiRoot, this.service);

  final SubstrateApi apiRoot;
  final ServiceBasic service;

  Future getWallet({required String mnemonic}) async {
    final res = await service.getWallet(
      mnemonic: mnemonic,
    );
    return res;
  }

  Future<dynamic> signTransaction({
    required String mnemonic,
    required String dest,
    required double amount,
    required bool submit,
    required String unit,
  }) async {
    final res = await service.signTransaction(
      mnemonic: mnemonic,
      dest: dest,
      amount: amount,
      submit: submit,
      unit: unit,
    );
    return res;
  }
}