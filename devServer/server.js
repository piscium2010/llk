/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "602f4d23261a2c838bb4"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {any} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nmodule.exports = function(updatedModules, renewedModules) {\r\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\r\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\r\n\t});\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tif (unacceptedModules.length > 0) {\r\n\t\tlog(\r\n\t\t\t\"warning\",\r\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\r\n\t\t);\r\n\t\tunacceptedModules.forEach(function(moduleId) {\r\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n\r\n\tif (!renewedModules || renewedModules.length === 0) {\r\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\r\n\t} else {\r\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\r\n\t\trenewedModules.forEach(function(moduleId) {\r\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\r\n\t\t\t\tvar parts = moduleId.split(\"!\");\r\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t\tlog.groupEnd(\"info\");\r\n\t\t\t} else {\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t}\r\n\t\t});\r\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\r\n\t\t\treturn typeof moduleId === \"number\";\r\n\t\t});\r\n\t\tif (numberIds)\r\n\t\t\tlog(\r\n\t\t\t\t\"info\",\r\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\r\n\t\t\t);\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\r\n\r\nfunction dummy() {}\r\n\r\nfunction shouldLog(level) {\r\n\tvar shouldLog =\r\n\t\t(logLevel === \"info\" && level === \"info\") ||\r\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\r\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\r\n\treturn shouldLog;\r\n}\r\n\r\nfunction logGroup(logFn) {\r\n\treturn function(level, msg) {\r\n\t\tif (shouldLog(level)) {\r\n\t\t\tlogFn(msg);\r\n\t\t}\r\n\t};\r\n}\r\n\r\nmodule.exports = function(level, msg) {\r\n\tif (shouldLog(level)) {\r\n\t\tif (level === \"info\") {\r\n\t\t\tconsole.log(msg);\r\n\t\t} else if (level === \"warning\") {\r\n\t\t\tconsole.warn(msg);\r\n\t\t} else if (level === \"error\") {\r\n\t\t\tconsole.error(msg);\r\n\t\t}\r\n\t}\r\n};\r\n\r\nvar group = console.group || dummy;\r\nvar groupCollapsed = console.groupCollapsed || dummy;\r\nvar groupEnd = console.groupEnd || dummy;\r\n\r\nmodule.exports.group = logGroup(group);\r\n\r\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\r\n\r\nmodule.exports.groupEnd = logGroup(groupEnd);\r\n\r\nmodule.exports.setLogLevel = function(level) {\r\n\tlogLevel = level;\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n/*globals __resourceQuery */\r\nif (true) {\r\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\r\n\t\tif (module.hot.status() === \"idle\") {\r\n\t\t\tmodule.hot\r\n\t\t\t\t.check(true)\r\n\t\t\t\t.then(function(updatedModules) {\r\n\t\t\t\t\tif (!updatedModules) {\r\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\r\n\t\t\t\t\t\treturn;\r\n\t\t\t\t\t}\r\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\r\n\t\t\t\t\tcheckForUpdate(true);\r\n\t\t\t\t})\r\n\t\t\t\t.catch(function(err) {\r\n\t\t\t\t\tvar status = module.hot.status();\r\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t}\r\n\t};\r\n\tsetInterval(checkForUpdate, hotPollInterval);\r\n} else {}\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/server/constants.js":
/*!*********************************!*\
  !*** ./src/server/constants.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nvar CODE = exports.CODE = {\n    ERROR: 'ERROR',\n    EMAIL_EXISTED: 'EMAIL_EXISTED',\n    INVALID: 'INVALID',\n    WRONG_CREDENTIAL: 'WRONG_CREDENTIAL',\n    DONE: 'DONE',\n    NOT_LOGIN: 'NOT_LOGIN',\n    NOT_ACTIVE: 'NOT_ACTIVE'\n};\n\n//# sourceURL=webpack:///./src/server/constants.js?");

/***/ }),

/***/ "./src/server/db.js":
/*!**************************!*\
  !*** ./src/server/db.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.getCourses = exports.getLink = exports.addUserLink = exports.saveUser = exports.findUser = exports.addUser = exports.tables = undefined;\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/server/util.js\");\n\nvar _mongodb = __webpack_require__(/*! mongodb */ \"mongodb\");\n\nvar _mongodb2 = _interopRequireDefault(_mongodb);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//var MongoClient = require('mongodb').MongoClient;\nvar MongoClient = _mongodb2.default.MongoClient;\nvar url = \"mongodb://localhost:27017/llk\";\n\nfunction connect() {\n  return new Promise(function (resolve, reject) {\n    MongoClient.connect(url, function (err, db) {\n      if (err) {\n        reject(err);\n      }\n      resolve(db);\n    });\n  });\n}\n\nfunction exec(action) {\n  var _db = void 0;\n  return connect().then(function (db) {\n    _db = db;\n    return action.bind(null, _db.db('llk'))();\n  }).then(function (result) {\n    _db.close();\n    return result;\n  }).catch(function (err) {\n    _db.close();\n    throw err;\n  });\n}\n\n// MongoClient.connect(url, function(err, db) {\n//   if (err) throw err;\n//   let dbo = db.db(\"llk\");\n\n//   dbo.createCollection(\"users\", function(err, res) {\n//     if (err) throw err;\n//     db.close()\n//   });\n\n//   console.log(\"Collection created!\");\n// });\n\n/*\n* init db  \n*/\n// let _db\n// connect().then(db=>{\n//   _db = db\n//   return Promise.all([\n//     db.createCollection('users'),\n//     db.createCollection('courses')\n//   ])\n// }).then(()=>{\n//   _db.close()\n// }).catch(err=>{\n//   _db.close()\n//   throw err\n// })\n\nvar tables = exports.tables = {\n  users: 'users',\n  courses: 'courses',\n  user_links: 'user_links'\n};\n\nexec(function (db) {\n  return Promise.all([db.createCollection(tables.users), db.createCollection(tables.courses), db.createCollection(tables.user_links)]);\n});\n\n//test()\n\n\n// function action(n,t) {\n//   return new Promise((res,rej)=>{\n//     console.log(n)\n//     if(t) {\n//       setTimeout(()=>{\n//         res()\n//       },t)\n//     }\n//     else {\n//       res()\n//     }\n//   })\n// }\n\n// function test() {\n//   action('1').then(()=>{\n//     return action('2')\n//   }).then(()=>{\n//     console.log(`promise.finally`,Promise.finally)\n//   })\n// }\n\nvar addUser = exports.addUser = function addUser(email, password) {\n  return exec(function (db) {\n    return db.collection(tables.users).insertOne({\n      email: email,\n      password: password,\n      active: false,\n      registerDate: new Date().toISOString()\n    });\n  });\n};\n\nvar findUser = exports.findUser = function findUser(email) {\n  return exec(function (db) {\n    console.log('db find user', email);\n    return db.collection(tables.users).findOne({ email: email });\n  });\n};\n\nvar saveUser = exports.saveUser = function saveUser(query, user) {\n  return exec(function (db) {\n    return new Promise(function (resolve, reject) {\n      db.collection(tables.users).updateOne(query, { $set: user }, function (err, res) {\n        if (err) {\n          reject(err);\n        }\n        resolve(res);\n      });\n    });\n  });\n};\n\nvar addUserLink = exports.addUserLink = function addUserLink(email, type, data) {\n  return exec(function (db) {\n    var code = (0, _util.getRandomCode)(email);\n    console.log('code', code);\n    var document = {\n      email: email,\n      code: code,\n      type: type,\n      data: data,\n      date: new Date().toISOString()\n    };\n    return db.collection(tables.user_links).insertOne(document).then(function () {\n      return code;\n    });\n  });\n};\n\nvar getLink = exports.getLink = function getLink(code) {\n  return exec(function (db) {\n    return db.collection(tables.user_links).findOne({\n      code: code\n    });\n  });\n};\n\nvar getCourses = exports.getCourses = function getCourses(email) {\n  return exec(function (db) {\n    console.log('db getcourse');\n    return new Promise(function (resolve, reject) {\n      db.collection(tables.courses).find({ email: email }).toArray(function (err, res) {\n        console.log('db getcourse res', res);\n        if (err) reject(err);\n        resolve(res);\n      });\n    });\n  });\n};\n\n// export function addUser(email, password) {\n//   let _db\n//   connect().then(db => {\n//     _db = db\n//     return _db.collection('users').insertOne({\n//       email,\n//       password,\n//       registerDate: new Date().toISOString()\n//     })\n//   }).finally(() => {\n//     _db.close()\n//   })\n// }\n\n// export function findUser(email) {\n//   let _db\n//   connect().then(db=>{\n//     _db = db\n//     let user = _db.collection('users').find({email})\n//     _db.close()\n//     return user\n//   })\n// }\n\n//# sourceURL=webpack:///./src/server/db.js?");

/***/ }),

/***/ "./src/server/email.js":
/*!*****************************!*\
  !*** ./src/server/email.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sendMail = sendMail;\n\nvar _nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\n\nvar _nodemailer2 = _interopRequireDefault(_nodemailer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//var nodemailer = require('nodemailer');\n\nvar transporter = _nodemailer2.default.createTransport({\n  host: 'smtp.qq.com',\n  port: 465,\n  secure: true,\n  auth: {\n    user: '541032442@qq.com',\n    pass: 'gesjbtfngrbnbceg'\n  }\n});\n\nvar defaultMailOptions = {\n  from: '541032442@qq.com',\n  to: 'piscium2010@163.com',\n  subject: 'Sending Email using Node.js',\n  html: '<h1>Welcome</h1><p>That was easy!</p>'\n};\n\n//   transporter.sendMail(mailOptions, function(error, info){\n//     if (error) {\n//       console.log(error);\n//     } else {\n//       console.log('Email sent: ' + info.response);\n//     }\n//   });\n\n\nfunction sendMail(to, subject, html, callback) {\n  var mailOptions = Object.assign({}, defaultMailOptions, { to: to, subject: subject, html: html });\n  console.log('mailOptions', mailOptions);\n  transporter.sendMail(mailOptions, callback);\n\n  // transporter.sendMail(mailOptions, function(error, info){\n  //     if (error) {\n  //       throw error\n  //     } else {\n  //       console.log('Email sent: ' + info.response);\n  //       if(callback) {\n  //           callback()\n  //       }\n  //     }\n  // });\n}\n\n//# sourceURL=webpack:///./src/server/email.js?");

/***/ }),

/***/ "./src/server/index.js":
/*!*****************************!*\
  !*** ./src/server/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _http = __webpack_require__(/*! http */ \"http\");\n\nvar _http2 = _interopRequireDefault(_http);\n\nvar _server = __webpack_require__(/*! ./server */ \"./src/server/server.js\");\n\nvar _server2 = _interopRequireDefault(_server);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar server = _http2.default.createServer(_server2.default);\nvar currentApp = _server2.default;\nserver.listen(3000);\n\nif (true) {\n    module.hot.accept(/*! ./server */ \"./src/server/server.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function () {\n        reload();\n    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n    module.hot.accept(/*! ./db */ \"./src/server/db.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function () {\n        reload();\n    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n    module.hot.accept(/*! ./util */ \"./src/server/util.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function () {\n        reload();\n    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n    module.hot.accept(/*! ./email */ \"./src/server/email.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function () {\n        reload();\n    })(__WEBPACK_OUTDATED_DEPENDENCIES__); });\n}\n\nfunction reload() {\n    console.log(\"reload\");\n    server.removeListener(\"request\", currentApp);\n    server.on(\"request\", _server2.default);\n    currentApp = _server2.default;\n}\n\n//# sourceURL=webpack:///./src/server/index.js?");

/***/ }),

/***/ "./src/server/server.js":
/*!******************************!*\
  !*** ./src/server/server.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _constants = __webpack_require__(/*! ./constants */ \"./src/server/constants.js\");\n\nvar _db = __webpack_require__(/*! ./db */ \"./src/server/db.js\");\n\nvar _util = __webpack_require__(/*! ./util */ \"./src/server/util.js\");\n\nvar _email = __webpack_require__(/*! ./email */ \"./src/server/email.js\");\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar app = express();\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nvar session = __webpack_require__(/*! express-session */ \"express-session\");\n\napp.use(function (req, res, next) {\n    res.header(\"Access-Control-Allow-Origin\", \"*\");\n    res.header(\"Access-Control-Allow-Credentials\", true);\n    res.header(\"Access-Control-Allow-Methods\", \"POST, GET, PUT, DELETE, OPTIONS\");\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept\");\n    res.header('Content-Type', 'text/plain');\n    next();\n});\n\napp.use(session({\n    secret: 'keyboard cat',\n    resave: false,\n    saveUninitialized: true\n}));\n\napp.use(bodyParser.urlencoded({ extended: false }));\napp.use(bodyParser.json());\n\nvar site = 'llk';\nvar apiHost = 'http://localhost:3000/llk';\n\napp.get('/' + site + '/', function (req, res) {\n    console.log('session', req.session);\n    //req.session.uid = 'udi'\n    res.send('hello srts');\n});\n\napp.get('/' + site + '/findUser', function (req, res) {\n    console.log('find User');\n});\n\n//user links\napp.get('/' + site + '/links', function (req, res) {\n    console.log('links', req.query);\n    var code = req.query.code;\n    var msg = '';\n    (0, _db.getLink)(code).then(function (_ref) {\n        var email = _ref.email,\n            type = _ref.type;\n\n        if (email) {\n            console.log('result.type', type);\n            switch (type) {\n                case 'activate':\n                    msg = 'your account has been activated';\n                    return (0, _db.saveUser)({ email: email }, { active: true });\n                default:\n                    return Promise.reject();\n            }\n        }\n    }).then(function () {\n        res.send(msg);\n    }).catch(function (err) {\n        console.log('err', err);\n        res.send(_constants.CODE.ERROR);\n    });\n});\n\n//get courses\napp.get('/' + site + '/courses', function (req, res) {\n    var email = req.session.uid;\n    console.log('server courses session', req.session);\n\n    (0, _db.getCourses)(email).then(function (courses) {\n        if (courses) {\n            res.send(JSON.stringify(courses));\n        } else {\n            res.send(JSON.stringify(['examples']));\n        }\n    });\n});\n\napp.put('/' + site + '/addcourse', function (req, res) {\n    var courseName = req.body.courseName;\n    res.send('add cd');\n});\n\n//login\napp.post('/' + site + '/login', function (req, res) {\n    var _req$body = req.body,\n        email = _req$body.email,\n        password = _req$body.password;\n\n    console.log('server login', email, password);\n    (0, _db.findUser)(email).then(function (user) {\n        console.log('server login', user);\n        console.log('server login password', password);\n        if (!user) {\n            res.send(_constants.CODE.WRONG_CREDENTIAL);\n            return;\n        }\n\n        if (!user.active) {\n            res.send(_constants.CODE.NOT_ACTIVE);\n            return;\n        }\n\n        if (password.trim() !== user.password.trim()) {\n            console.log('', password.trim(), user.password.trim());\n            res.send(_constants.CODE.WRONG_CREDENTIAL);\n            return;\n        }\n\n        req.session.uid = email;\n        console.log('login session', req.session);\n        res.send(_constants.CODE.DONE);\n    });\n});\n\napp.post('/' + site + '/addcourse', function (req, res) {\n    console.log('param', req.body);\n    res.send('add');\n});\n\napp.post('/' + site + '/register', function (req, res) {\n    //console.log(`register`)\n\n    var _req$body2 = req.body,\n        email = _req$body2.email,\n        password = _req$body2.password;\n\n    console.log('email', email, password, req.body);\n\n    (0, _db.findUser)(email).then(function (result) {\n        if (result) {\n            if (result.active) {\n                res.send(_constants.CODE.EMAIL_EXISTED);\n            } else {\n                res.send(_constants.CODE.NOT_ACTIVE);\n            }\n            return;\n        }\n\n        (0, _db.addUser)(email, password).then(function () {\n            return (0, _db.addUserLink)(email, 'activate');\n        }).then(function (code) {\n            //send activate link\n            return new Promise(function (resolve, reject) {\n                var html = '<h1>Please click below link to activate your account</h1><p>' + apiHost + '/links?code=' + code + '</p>';\n                (0, _email.sendMail)(email, 'Please activate your account', html, function (err, info) {\n                    if (err) {\n                        reject(err);\n                    }\n                    resolve();\n                });\n            });\n        }).then(function () {\n            res.send(_constants.CODE.DONE);\n        }).catch(function (err) {\n            console.log('err', err);\n            res.send(_constants.CODE.ERROR);\n        });\n    });\n});\n\nexports.default = app;\n\n//# sourceURL=webpack:///./src/server/server.js?");

/***/ }),

/***/ "./src/server/util.js":
/*!****************************!*\
  !*** ./src/server/util.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.getRandomCode = getRandomCode;\n\nvar _crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nfunction getRandomCode(str) {\n    var date = new Date();\n    var name = '' + str + date.toISOString();\n    var hash = (0, _crypto.createHash)('md5').update(name).digest('hex');\n    return hash;\n}\n\n//# sourceURL=webpack:///./src/server/util.js?");

/***/ }),

/***/ 0:
/*!******************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/server/index ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! ./src/server/index */\"./src/server/index.js\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-session\");\n\n//# sourceURL=webpack:///external_%22express-session%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongodb\");\n\n//# sourceURL=webpack:///external_%22mongodb%22?");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer\");\n\n//# sourceURL=webpack:///external_%22nodemailer%22?");

/***/ })

/******/ });