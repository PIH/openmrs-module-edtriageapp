package org.openmrs.module.edtriageapp;

import org.apache.commons.lang.StringUtils;

public class EDTriageUtil {

	public static String parseUrl(String url, String parameterName) {
		String parameterValue = null;

		if (StringUtils.isNotBlank(url)) {
			int parameterStart = url.indexOf("?");
			if (parameterStart >= 0) {
				String substring = url.substring(parameterStart + 1);
				if (StringUtils.isNotBlank(substring)) {
					String[] kvPairs = substring.split("&");
					for (String kvPair : kvPairs) {
						int i = kvPair.indexOf("=");
						if (i > 0) {
							String key = kvPair.substring(0, i);
							String value = kvPair.substring(i + 1);
							if (StringUtils.equals(key, parameterName)) {
								parameterValue = value;
								break;
							}
						}
					}
				}
			}
		}

		return parameterValue;
	}
}
