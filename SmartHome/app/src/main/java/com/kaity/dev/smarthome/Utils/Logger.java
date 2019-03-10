package com.kaity.dev.smarthome.Utils;

import android.util.Log;

/**
 * This class defines the log policy, current logging level and provides utility
 * methods to interact with the Android log.
 */
public class Logger {

    /**
     * This level will disable the log printing.
     */
    private static final int LEVEL_DISABLED = 0;

    /**
     * Only print the error logs.
     */
    private static final int LEVEL_ERROR = LEVEL_DISABLED + 1;

    /**
     * Only print the warning and error logs.
     */
    private static final int LEVEL_WARNING = LEVEL_ERROR + 1;

    /**
     * Only print the information, warning and error logs.
     */
    private static final int LEVEL_INFORMATION = LEVEL_WARNING + 1;

    /**
     * Only print the debug, information, warning and error log.
     */
    private static final int LEVEL_DEBUG = LEVEL_INFORMATION + 1;

    /**
     * Current logging level. All log utility methods will check for this flag
     * to filter the output.
     */
    private static int sCurrentLoggingLevel = LEVEL_DEBUG;

    /**
     * Print the tag name or not. To prevent some security risks about leaking
     * the class name through the logcat after releasing. We can stop printing
     * the class name here. If this variable is set to false, the class name
     * will not be printed out.
     */
    private static boolean sPrintClassName = true;

    /**
     * Print the log content at debug level with caller's class name.
     *
     * @param tag     Log tag.
     * @param caller  Caller object
     * @param content Log content
     */
    public static void d(Object caller, String method, String content) {
        if (sCurrentLoggingLevel >= LEVEL_DEBUG) {
            printLog(Log.DEBUG, caller, method, content);
        }
    }

    /**
     * Print the log content at information level with caller's class name.
     *
     * @param tag     Log tag.
     * @param caller  Caller object
     * @param content Log content
     */
    public static void i(Object caller, String method, String content) {
        if (sCurrentLoggingLevel >= LEVEL_INFORMATION) {
            printLog(Log.INFO, caller, method, content);
        }
    }

    /**
     * Print the log content at warning level with caller's class name.
     *
     * @param tag     Log tag.
     * @param caller  Caller object
     * @param content Log content
     */
    public static void w(Object caller, String method, String content) {
        if (sCurrentLoggingLevel >= LEVEL_WARNING) {
            printLog(Log.WARN, caller, method, content);
        }
    }

    /**
     * Print the log content at error level with caller's class name.
     *
     * @param tag     Log tag.
     * @param caller  Caller object
     * @param content Log content
     */
    public static void e(Object caller, String method, String content) {
        if (sCurrentLoggingLevel >= LEVEL_ERROR) {
            printLog(Log.ERROR, caller, method, content);
        }
    }

    /**
     * Print the formatted logcat, this method will print the log in the
     * following format: "[class name]log content" If the caller is not
     * specified,
     * it will print the log with content as normal.
     *
     * @param logLevel Log level to be printed.
     * @param tag      Log tag.
     * @param caller   Caller object of the log method.
     * @param content  Log content.
     */
    private static void printLog(int logLevel, Object caller, String method,
                                 String content) {
        String outputTag = "";
        String outputContent = "";

        outputTag = "SmartHome";

        if (caller != null && sPrintClassName) {
            outputContent += "[" + caller.getClass().getSimpleName() + "] ";
        }

        if (method != null) {
            outputContent += "[" + method + "] ";
        }

        if (content != null) {
            outputContent += content;
        }

        switch (logLevel) {
            case Log.DEBUG:
                Log.d(outputTag, outputContent);
                break;
            case Log.INFO:
                Log.i(outputTag, outputContent);
                break;
            case Log.WARN:
                Log.w(outputTag, outputContent);
                break;
            case Log.ERROR:
                Log.e(outputTag, outputContent);
                break;
        }
    }
}
