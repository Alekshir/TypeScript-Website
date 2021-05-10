define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createURLQueryWithCompilerOptions = exports.getCompilerOptionsFromParams = exports.getDefaultSandboxCompilerOptions = void 0;
    /**
     * These are the defaults, but they also act as the list of all compiler options
     * which are parsed in the query params.
     */
    function getDefaultSandboxCompilerOptions(config, monaco) {
        const useJavaScript = config.filetype === "js";
        const settings = {
            noImplicitAny: true,
            strictNullChecks: !useJavaScript,
            strictFunctionTypes: true,
            strictPropertyInitialization: true,
            strictBindCallApply: true,
            noImplicitThis: true,
            noImplicitReturns: true,
            noUncheckedIndexedAccess: false,
            // 3.7 off, 3.8 on I think
            useDefineForClassFields: false,
            alwaysStrict: true,
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            downlevelIteration: false,
            noEmitHelpers: false,
            noLib: false,
            noStrictGenericChecks: false,
            noUnusedLocals: false,
            noUnusedParameters: false,
            esModuleInterop: true,
            preserveConstEnums: false,
            removeComments: false,
            skipLibCheck: false,
            checkJs: useJavaScript,
            allowJs: useJavaScript,
            declaration: true,
            importHelpers: false,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            target: monaco.languages.typescript.ScriptTarget.ES2017,
            jsx: monaco.languages.typescript.JsxEmit.React,
            module: monaco.languages.typescript.ModuleKind.ESNext,
        };
        return Object.assign(Object.assign({}, settings), config.compilerOptions);
    }
    exports.getDefaultSandboxCompilerOptions = getDefaultSandboxCompilerOptions;
    /**
     * Loop through all of the entries in the existing compiler options then compare them with the
     * query params and return an object which is the changed settings via the query params
     */
    const getCompilerOptionsFromParams = (options, params) => {
        const urlDefaults = Object.entries(options).reduce((acc, [key, value]) => {
            if (params.has(key)) {
                const urlValue = params.get(key);
                if (urlValue === "true") {
                    acc[key] = true;
                }
                else if (urlValue === "false") {
                    acc[key] = false;
                }
                else if (!isNaN(parseInt(urlValue, 10))) {
                    acc[key] = parseInt(urlValue, 10);
                }
            }
            return acc;
        }, {});
        return urlDefaults;
    };
    exports.getCompilerOptionsFromParams = getCompilerOptionsFromParams;
    // Can't set sandbox to be the right type because the param would contain this function
    /** Gets a query string representation (hash + queries) */
    const createURLQueryWithCompilerOptions = (sandbox, paramOverrides) => {
        const compilerOptions = sandbox.getCompilerOptions();
        const compilerDefaults = sandbox.compilerDefaults;
        const diff = Object.entries(compilerOptions).reduce((acc, [key, value]) => {
            if (value !== compilerDefaults[key]) {
                // @ts-ignore
                acc[key] = compilerOptions[key];
            }
            return acc;
        }, {});
        // The text of the TS/JS as the hash
        const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`;
        let urlParams = Object.assign({}, diff);
        for (const param of ["lib", "ts"]) {
            const params = new URLSearchParams(location.search);
            if (params.has(param)) {
                // Special case the nightly where it uses the TS version to hardcode
                // the nightly build
                if (param === "ts" && (params.get(param) === "Nightly" || params.get(param) === "next")) {
                    urlParams["ts"] = sandbox.ts.version;
                }
                else {
                    urlParams["ts"] = params.get(param);
                }
            }
        }
        // Support sending the selection
        const s = sandbox.editor.getSelection();
        // TODO: when it's full
        if ((s && s.selectionStartLineNumber !== s.positionLineNumber) ||
            (s && s.selectionStartColumn !== s.positionColumn)) {
            urlParams["ssl"] = s.selectionStartLineNumber;
            urlParams["ssc"] = s.selectionStartColumn;
            urlParams["pln"] = s.positionLineNumber;
            urlParams["pc"] = s.positionColumn;
        }
        else {
            urlParams["ssl"] = undefined;
            urlParams["ssc"] = undefined;
            urlParams["pln"] = undefined;
            urlParams["pc"] = undefined;
        }
        if (sandbox.config.filetype !== "ts")
            urlParams["filetype"] = sandbox.config.filetype;
        if (paramOverrides) {
            urlParams = Object.assign(Object.assign({}, urlParams), paramOverrides);
        }
        if (Object.keys(urlParams).length > 0) {
            const queryString = Object.entries(urlParams)
                .filter(([_k, v]) => v !== undefined)
                .filter(([_k, v]) => v !== null)
                .map(([key, value]) => {
                return `${key}=${encodeURIComponent(value)}`;
            })
                .join("&");
            return `?${queryString}#${hash}`;
        }
        else {
            return `#${hash}`;
        }
    };
    exports.createURLQueryWithCompilerOptions = createURLQueryWithCompilerOptions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvY29tcGlsZXJPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQTs7O09BR0c7SUFDSCxTQUFnQixnQ0FBZ0MsQ0FBQyxNQUFxQixFQUFFLE1BQWM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUE7UUFDOUMsTUFBTSxRQUFRLEdBQW9CO1lBQ2hDLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGdCQUFnQixFQUFFLENBQUMsYUFBYTtZQUNoQyxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLDRCQUE0QixFQUFFLElBQUk7WUFDbEMsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixjQUFjLEVBQUUsSUFBSTtZQUNwQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLHdCQUF3QixFQUFFLEtBQUs7WUFFL0IsMEJBQTBCO1lBQzFCLHVCQUF1QixFQUFFLEtBQUs7WUFFOUIsWUFBWSxFQUFFLElBQUk7WUFDbEIsb0JBQW9CLEVBQUUsS0FBSztZQUMzQixpQkFBaUIsRUFBRSxLQUFLO1lBRXhCLGtCQUFrQixFQUFFLEtBQUs7WUFDekIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsS0FBSyxFQUFFLEtBQUs7WUFDWixxQkFBcUIsRUFBRSxLQUFLO1lBQzVCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGtCQUFrQixFQUFFLEtBQUs7WUFFekIsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixjQUFjLEVBQUUsS0FBSztZQUNyQixZQUFZLEVBQUUsS0FBSztZQUVuQixPQUFPLEVBQUUsYUFBYTtZQUN0QixPQUFPLEVBQUUsYUFBYTtZQUN0QixXQUFXLEVBQUUsSUFBSTtZQUVqQixhQUFhLEVBQUUsS0FBSztZQUVwQixzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLHFCQUFxQixFQUFFLElBQUk7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QTtZQUM1QixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFBO1NBQzVCO1FBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJO1lBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBRXJGLElBQUksY0FBYyxFQUFFO1lBQ2xCLFNBQVMsbUNBQVEsU0FBUyxHQUFLLGNBQWMsQ0FBRSxDQUFBO1NBQ2hEO1FBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7aUJBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO2lCQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQztpQkFDL0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDcEIsT0FBTyxHQUFHLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxLQUFlLENBQUMsRUFBRSxDQUFBO1lBQ3hELENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFWixPQUFPLElBQUksV0FBVyxJQUFJLElBQUksRUFBRSxDQUFBO1NBQ2pDO2FBQU07WUFDTCxPQUFPLElBQUksSUFBSSxFQUFFLENBQUE7U0FDbEI7SUFDSCxDQUFDLENBQUE7SUFsRVksUUFBQSxpQ0FBaUMscUNBa0U3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNhbmRib3hDb25maWcgfSBmcm9tIFwiLlwiXG5cbnR5cGUgQ29tcGlsZXJPcHRpb25zID0gaW1wb3J0KFwibW9uYWNvLWVkaXRvclwiKS5sYW5ndWFnZXMudHlwZXNjcmlwdC5Db21waWxlck9wdGlvbnNcbnR5cGUgTW9uYWNvID0gdHlwZW9mIGltcG9ydChcIm1vbmFjby1lZGl0b3JcIilcblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIGRlZmF1bHRzLCBidXQgdGhleSBhbHNvIGFjdCBhcyB0aGUgbGlzdCBvZiBhbGwgY29tcGlsZXIgb3B0aW9uc1xuICogd2hpY2ggYXJlIHBhcnNlZCBpbiB0aGUgcXVlcnkgcGFyYW1zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFNhbmRib3hDb21waWxlck9wdGlvbnMoY29uZmlnOiBTYW5kYm94Q29uZmlnLCBtb25hY286IE1vbmFjbykge1xuICBjb25zdCB1c2VKYXZhU2NyaXB0ID0gY29uZmlnLmZpbGV0eXBlID09PSBcImpzXCJcbiAgY29uc3Qgc2V0dGluZ3M6IENvbXBpbGVyT3B0aW9ucyA9IHtcbiAgICBub0ltcGxpY2l0QW55OiB0cnVlLFxuICAgIHN0cmljdE51bGxDaGVja3M6ICF1c2VKYXZhU2NyaXB0LFxuICAgIHN0cmljdEZ1bmN0aW9uVHlwZXM6IHRydWUsXG4gICAgc3RyaWN0UHJvcGVydHlJbml0aWFsaXphdGlvbjogdHJ1ZSxcbiAgICBzdHJpY3RCaW5kQ2FsbEFwcGx5OiB0cnVlLFxuICAgIG5vSW1wbGljaXRUaGlzOiB0cnVlLFxuICAgIG5vSW1wbGljaXRSZXR1cm5zOiB0cnVlLFxuICAgIG5vVW5jaGVja2VkSW5kZXhlZEFjY2VzczogZmFsc2UsXG5cbiAgICAvLyAzLjcgb2ZmLCAzLjggb24gSSB0aGlua1xuICAgIHVzZURlZmluZUZvckNsYXNzRmllbGRzOiBmYWxzZSxcblxuICAgIGFsd2F5c1N0cmljdDogdHJ1ZSxcbiAgICBhbGxvd1VucmVhY2hhYmxlQ29kZTogZmFsc2UsXG4gICAgYWxsb3dVbnVzZWRMYWJlbHM6IGZhbHNlLFxuXG4gICAgZG93bmxldmVsSXRlcmF0aW9uOiBmYWxzZSxcbiAgICBub0VtaXRIZWxwZXJzOiBmYWxzZSxcbiAgICBub0xpYjogZmFsc2UsXG4gICAgbm9TdHJpY3RHZW5lcmljQ2hlY2tzOiBmYWxzZSxcbiAgICBub1VudXNlZExvY2FsczogZmFsc2UsXG4gICAgbm9VbnVzZWRQYXJhbWV0ZXJzOiBmYWxzZSxcblxuICAgIGVzTW9kdWxlSW50ZXJvcDogdHJ1ZSxcbiAgICBwcmVzZXJ2ZUNvbnN0RW51bXM6IGZhbHNlLFxuICAgIHJlbW92ZUNvbW1lbnRzOiBmYWxzZSxcbiAgICBza2lwTGliQ2hlY2s6IGZhbHNlLFxuXG4gICAgY2hlY2tKczogdXNlSmF2YVNjcmlwdCxcbiAgICBhbGxvd0pzOiB1c2VKYXZhU2NyaXB0LFxuICAgIGRlY2xhcmF0aW9uOiB0cnVlLFxuXG4gICAgaW1wb3J0SGVscGVyczogZmFsc2UsXG5cbiAgICBleHBlcmltZW50YWxEZWNvcmF0b3JzOiB0cnVlLFxuICAgIGVtaXREZWNvcmF0b3JNZXRhZGF0YTogdHJ1ZSxcbiAgICBtb2R1bGVSZXNvbHV0aW9uOiBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuTW9kdWxlUmVzb2x1dGlvbktpbmQuTm9kZUpzLFxuXG4gICAgdGFyZ2V0OiBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuU2NyaXB0VGFyZ2V0LkVTMjAxNyxcbiAgICBqc3g6IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Kc3hFbWl0LlJlYWN0LFxuICAgIG1vZHVsZTogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0Lk1vZHVsZUtpbmQuRVNOZXh0LFxuICB9XG5cbiAgcmV0dXJuIHsgLi4uc2V0dGluZ3MsIC4uLmNvbmZpZy5jb21waWxlck9wdGlvbnMgfVxufVxuXG4vKipcbiAqIExvb3AgdGhyb3VnaCBhbGwgb2YgdGhlIGVudHJpZXMgaW4gdGhlIGV4aXN0aW5nIGNvbXBpbGVyIG9wdGlvbnMgdGhlbiBjb21wYXJlIHRoZW0gd2l0aCB0aGVcbiAqIHF1ZXJ5IHBhcmFtcyBhbmQgcmV0dXJuIGFuIG9iamVjdCB3aGljaCBpcyB0aGUgY2hhbmdlZCBzZXR0aW5ncyB2aWEgdGhlIHF1ZXJ5IHBhcmFtc1xuICovXG5leHBvcnQgY29uc3QgZ2V0Q29tcGlsZXJPcHRpb25zRnJvbVBhcmFtcyA9IChvcHRpb25zOiBDb21waWxlck9wdGlvbnMsIHBhcmFtczogVVJMU2VhcmNoUGFyYW1zKTogQ29tcGlsZXJPcHRpb25zID0+IHtcbiAgY29uc3QgdXJsRGVmYXVsdHMgPSBPYmplY3QuZW50cmllcyhvcHRpb25zKS5yZWR1Y2UoKGFjYzogYW55LCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAocGFyYW1zLmhhcyhrZXkpKSB7XG4gICAgICBjb25zdCB1cmxWYWx1ZSA9IHBhcmFtcy5nZXQoa2V5KSFcblxuICAgICAgaWYgKHVybFZhbHVlID09PSBcInRydWVcIikge1xuICAgICAgICBhY2Nba2V5XSA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAodXJsVmFsdWUgPT09IFwiZmFsc2VcIikge1xuICAgICAgICBhY2Nba2V5XSA9IGZhbHNlXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihwYXJzZUludCh1cmxWYWx1ZSwgMTApKSkge1xuICAgICAgICBhY2Nba2V5XSA9IHBhcnNlSW50KHVybFZhbHVlLCAxMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxuXG4gIHJldHVybiB1cmxEZWZhdWx0c1xufVxuXG4vLyBDYW4ndCBzZXQgc2FuZGJveCB0byBiZSB0aGUgcmlnaHQgdHlwZSBiZWNhdXNlIHRoZSBwYXJhbSB3b3VsZCBjb250YWluIHRoaXMgZnVuY3Rpb25cblxuLyoqIEdldHMgYSBxdWVyeSBzdHJpbmcgcmVwcmVzZW50YXRpb24gKGhhc2ggKyBxdWVyaWVzKSAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyA9IChzYW5kYm94OiBhbnksIHBhcmFtT3ZlcnJpZGVzPzogYW55KTogc3RyaW5nID0+IHtcbiAgY29uc3QgY29tcGlsZXJPcHRpb25zID0gc2FuZGJveC5nZXRDb21waWxlck9wdGlvbnMoKVxuICBjb25zdCBjb21waWxlckRlZmF1bHRzID0gc2FuZGJveC5jb21waWxlckRlZmF1bHRzXG4gIGNvbnN0IGRpZmYgPSBPYmplY3QuZW50cmllcyhjb21waWxlck9wdGlvbnMpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAodmFsdWUgIT09IGNvbXBpbGVyRGVmYXVsdHNba2V5XSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgYWNjW2tleV0gPSBjb21waWxlck9wdGlvbnNba2V5XVxuICAgIH1cblxuICAgIHJldHVybiBhY2NcbiAgfSwge30pXG5cbiAgLy8gVGhlIHRleHQgb2YgdGhlIFRTL0pTIGFzIHRoZSBoYXNoXG4gIGNvbnN0IGhhc2ggPSBgY29kZS8ke3NhbmRib3gubHpzdHJpbmcuY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQoc2FuZGJveC5nZXRUZXh0KCkpfWBcblxuICBsZXQgdXJsUGFyYW1zOiBhbnkgPSBPYmplY3QuYXNzaWduKHt9LCBkaWZmKVxuICBmb3IgKGNvbnN0IHBhcmFtIG9mIFtcImxpYlwiLCBcInRzXCJdKSB7XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpXG4gICAgaWYgKHBhcmFtcy5oYXMocGFyYW0pKSB7XG4gICAgICAvLyBTcGVjaWFsIGNhc2UgdGhlIG5pZ2h0bHkgd2hlcmUgaXQgdXNlcyB0aGUgVFMgdmVyc2lvbiB0byBoYXJkY29kZVxuICAgICAgLy8gdGhlIG5pZ2h0bHkgYnVpbGRcbiAgICAgIGlmIChwYXJhbSA9PT0gXCJ0c1wiICYmIChwYXJhbXMuZ2V0KHBhcmFtKSA9PT0gXCJOaWdodGx5XCIgfHwgcGFyYW1zLmdldChwYXJhbSkgPT09IFwibmV4dFwiKSkge1xuICAgICAgICB1cmxQYXJhbXNbXCJ0c1wiXSA9IHNhbmRib3gudHMudmVyc2lvblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsUGFyYW1zW1widHNcIl0gPSBwYXJhbXMuZ2V0KHBhcmFtKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN1cHBvcnQgc2VuZGluZyB0aGUgc2VsZWN0aW9uXG4gIGNvbnN0IHMgPSBzYW5kYm94LmVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAvLyBUT0RPOiB3aGVuIGl0J3MgZnVsbFxuICBpZiAoXG4gICAgKHMgJiYgcy5zZWxlY3Rpb25TdGFydExpbmVOdW1iZXIgIT09IHMucG9zaXRpb25MaW5lTnVtYmVyKSB8fFxuICAgIChzICYmIHMuc2VsZWN0aW9uU3RhcnRDb2x1bW4gIT09IHMucG9zaXRpb25Db2x1bW4pXG4gICkge1xuICAgIHVybFBhcmFtc1tcInNzbFwiXSA9IHMuc2VsZWN0aW9uU3RhcnRMaW5lTnVtYmVyXG4gICAgdXJsUGFyYW1zW1wic3NjXCJdID0gcy5zZWxlY3Rpb25TdGFydENvbHVtblxuICAgIHVybFBhcmFtc1tcInBsblwiXSA9IHMucG9zaXRpb25MaW5lTnVtYmVyXG4gICAgdXJsUGFyYW1zW1wicGNcIl0gPSBzLnBvc2l0aW9uQ29sdW1uXG4gIH0gZWxzZSB7XG4gICAgdXJsUGFyYW1zW1wic3NsXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wic3NjXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wicGxuXCJdID0gdW5kZWZpbmVkXG4gICAgdXJsUGFyYW1zW1wicGNcIl0gPSB1bmRlZmluZWRcbiAgfVxuXG4gIGlmIChzYW5kYm94LmNvbmZpZy5maWxldHlwZSAhPT0gXCJ0c1wiKSB1cmxQYXJhbXNbXCJmaWxldHlwZVwiXSA9IHNhbmRib3guY29uZmlnLmZpbGV0eXBlXG5cbiAgaWYgKHBhcmFtT3ZlcnJpZGVzKSB7XG4gICAgdXJsUGFyYW1zID0geyAuLi51cmxQYXJhbXMsIC4uLnBhcmFtT3ZlcnJpZGVzIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyh1cmxQYXJhbXMpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHVybFBhcmFtcylcbiAgICAgIC5maWx0ZXIoKFtfaywgdl0pID0+IHYgIT09IHVuZGVmaW5lZClcbiAgICAgIC5maWx0ZXIoKFtfaywgdl0pID0+IHYgIT09IG51bGwpXG4gICAgICAubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgcmV0dXJuIGAke2tleX09JHtlbmNvZGVVUklDb21wb25lbnQodmFsdWUgYXMgc3RyaW5nKX1gXG4gICAgICB9KVxuICAgICAgLmpvaW4oXCImXCIpXG5cbiAgICByZXR1cm4gYD8ke3F1ZXJ5U3RyaW5nfSMke2hhc2h9YFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBgIyR7aGFzaH1gXG4gIH1cbn1cbiJdfQ==