pref("dom.payment.skipHTTPSCheck", true);
pref("dom.identity.enabled", true);
pref("toolkit.identity.debug", true);

pref("dom.payment.provider.1.name", "firefoxmarketdev");
pref("dom.payment.provider.1.description", "marketplace-dev.allizom.org");
pref("dom.payment.provider.1.uri", "https://marketplace-dev.allizom.org/mozpay/?req=");
pref("dom.payment.provider.1.type", "mozilla-dev/payments/pay/v1");
pref("dom.payment.provider.1.requestMethod", "GET");

pref("dom.payment.provider.2.name", "firefoxmarketstage");
pref("dom.payment.provider.2.description", "marketplace.allizom.org");
pref("dom.payment.provider.2.uri", "https://marketplace.allizom.org/mozpay/?req=");
pref("dom.payment.provider.2.type", "mozilla-stage/payments/pay/v1");
pref("dom.payment.provider.2.requestMethod", "GET");

pref("dom.payment.provider.3.name", "firefoxmarketlocal");
pref("dom.payment.provider.3.description", "localhost");
pref("dom.payment.provider.3.uri", "http://localhost:8000/mozpay/?req=");
pref("dom.payment.provider.3.type", "mozilla-local/payments/pay/v1");
pref("dom.payment.provider.3.requestMethod", "GET");
