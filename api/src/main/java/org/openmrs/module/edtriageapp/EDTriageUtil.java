package org.openmrs.module.edtriageapp;

import org.apache.commons.lang.StringUtils;

public class EDTriageUtil {

    public static String parseUrl(String url, String parameterName) {
        String parameterValue = null;

        if (StringUtils.isNotBlank(url)) {
            String substring = url.substring(url.indexOf("?") + 1);
            if (StringUtils.isNotBlank(substring)) {
                String[] kvPairs = substring.split("&");
                if (kvPairs != null && kvPairs.length > 0) {
                    for (String kvPair: kvPairs) {
                        int i = kvPair.indexOf("=");
                        String key = null;
                        String value = null;
                        if (i > 0) {
                            key = kvPair.substring(0, i);
                            value = kvPair.substring(i + 1);
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
