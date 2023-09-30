/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EffectScope: () => (/* binding */ EffectScope),
/* harmony export */   ITERATE_KEY: () => (/* binding */ ITERATE_KEY),
/* harmony export */   ReactiveEffect: () => (/* binding */ ReactiveEffect),
/* harmony export */   computed: () => (/* binding */ computed),
/* harmony export */   customRef: () => (/* binding */ customRef),
/* harmony export */   deferredComputed: () => (/* binding */ deferredComputed),
/* harmony export */   effect: () => (/* binding */ effect),
/* harmony export */   effectScope: () => (/* binding */ effectScope),
/* harmony export */   enableTracking: () => (/* binding */ enableTracking),
/* harmony export */   getCurrentScope: () => (/* binding */ getCurrentScope),
/* harmony export */   isProxy: () => (/* binding */ isProxy),
/* harmony export */   isReactive: () => (/* binding */ isReactive),
/* harmony export */   isReadonly: () => (/* binding */ isReadonly),
/* harmony export */   isRef: () => (/* binding */ isRef),
/* harmony export */   isShallow: () => (/* binding */ isShallow),
/* harmony export */   markRaw: () => (/* binding */ markRaw),
/* harmony export */   onScopeDispose: () => (/* binding */ onScopeDispose),
/* harmony export */   pauseTracking: () => (/* binding */ pauseTracking),
/* harmony export */   proxyRefs: () => (/* binding */ proxyRefs),
/* harmony export */   reactive: () => (/* binding */ reactive),
/* harmony export */   readonly: () => (/* binding */ readonly),
/* harmony export */   ref: () => (/* binding */ ref),
/* harmony export */   resetTracking: () => (/* binding */ resetTracking),
/* harmony export */   shallowReactive: () => (/* binding */ shallowReactive),
/* harmony export */   shallowReadonly: () => (/* binding */ shallowReadonly),
/* harmony export */   shallowRef: () => (/* binding */ shallowRef),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   toRaw: () => (/* binding */ toRaw),
/* harmony export */   toRef: () => (/* binding */ toRef),
/* harmony export */   toRefs: () => (/* binding */ toRefs),
/* harmony export */   toValue: () => (/* binding */ toValue),
/* harmony export */   track: () => (/* binding */ track),
/* harmony export */   trigger: () => (/* binding */ trigger),
/* harmony export */   triggerRef: () => (/* binding */ triggerRef),
/* harmony export */   unref: () => (/* binding */ unref)
/* harmony export */ });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");


function warn(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}

let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    /**
     * @internal
     */
    this._active = true;
    /**
     * @internal
     */
    this.effects = [];
    /**
     * @internal
     */
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else if (true) {
      warn(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else if (true) {
    warn(
      `onScopeDispose() is called when there is no active effect scope to be associated with.`
    );
  }
}

const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};

const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol( true ? "iterate" : 0);
const MAP_KEY_ITERATE_KEY = Symbol( true ? "Map key iterate" : 0);
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
function effect(fn, options) {
  if (fn.effect) {
    fn = fn.effect.fn;
  }
  const _effect = new ReactiveEffect(fn);
  if (options) {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)(_effect, options);
    if (options.scope)
      recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function stop(runner) {
  runner.effect.stop();
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    const eventInfo =  true ? { effect: activeEffect, target, type, key } : 0;
    trackEffects(dep, eventInfo);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if ( true && activeEffect.onTrack) {
      activeEffect.onTrack(
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)(
          {
            effect: activeEffect
          },
          debuggerEventExtraInfo
        )
      );
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const eventInfo =  true ? { target, type, key, newValue, oldValue, oldTarget } : 0;
  if (deps.length === 1) {
    if (deps[0]) {
      if (true) {
        triggerEffects(deps[0], eventInfo);
      } else {}
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    if (true) {
      triggerEffects(createDep(effects), eventInfo);
    } else {}
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2, debuggerEventExtraInfo);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2, debuggerEventExtraInfo);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if ( true && effect2.onTrigger) {
      effect2.onTrigger((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)({ effect: effect2 }, debuggerEventExtraInfo));
    }
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}

const isNonTrackableKeys = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.makeMap)(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)
);
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target);
    if (!isReadonly2) {
      if (targetIsArray && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key) ? res : res.value;
    }
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isIntegerKey)(key) ? Number(key) < target.length : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isSymbol)(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
);
const shallowReadonlyHandlers = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.extend)(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
);

const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target["__v_raw"];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(target) ? new Map(target) : new Set(target) : 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isMap)(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(
        `${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.capitalize)(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasOwn)(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(target);
    console.warn(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}

const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1 /* COMMON */;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2 /* COLLECTION */;
    default:
      return 0 /* INVALID */;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 /* INVALID */ : targetTypeMap((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.toRawType)(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0 /* INVALID */) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.def)(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? reactive(value) : value;
const toReadonly = (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(value) ? readonly(value) : value;

function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    if (true) {
      trackEffects(ref2.dep || (ref2.dep = createDep()), {
        target: ref2,
        type: "get",
        key: "value"
      });
    } else {}
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    if (true) {
      triggerEffects(dep, {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      });
    } else {}
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.hasChanged)(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2,  true ? ref2.value : 0);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(source) ? source() : unref(source);
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get, set } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get;
    this._set = set;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  if ( true && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`);
  }
  const ret = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(source)) {
    return new GetterRefImpl(source);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(
    source,
    key,
    defaultValue
  );
}

class ComputedRefImpl {
  constructor(getter, _setter, isReadonly, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly;
  }
  get value() {
    const self = toRaw(this);
    trackRefValue(self);
    if (self._dirty || !self._cacheable) {
      self._dirty = false;
      self._value = self.effect.run();
    }
    return self._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter =  true ? () => {
      console.warn("Write operation failed: computed value is readonly");
    } : 0;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if ( true && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}

const tick = /* @__PURE__ */ Promise.resolve();
const queue = [];
let queued = false;
const scheduler = (fn) => {
  queue.push(fn);
  if (!queued) {
    queued = true;
    tick.then(flush);
  }
};
const flush = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }
  queue.length = 0;
  queued = false;
};
class DeferredComputedRefImpl {
  constructor(getter) {
    this.dep = void 0;
    this._dirty = true;
    this.__v_isRef = true;
    this["__v_isReadonly"] = true;
    let compareTarget;
    let hasCompareTarget = false;
    let scheduled = false;
    this.effect = new ReactiveEffect(getter, (computedTrigger) => {
      if (this.dep) {
        if (computedTrigger) {
          compareTarget = this._value;
          hasCompareTarget = true;
        } else if (!scheduled) {
          const valueToCompare = hasCompareTarget ? compareTarget : this._value;
          scheduled = true;
          hasCompareTarget = false;
          scheduler(() => {
            if (this.effect.active && this._get() !== valueToCompare) {
              triggerRefValue(this);
            }
            scheduled = false;
          });
        }
        for (const e of this.dep) {
          if (e.computed instanceof DeferredComputedRefImpl) {
            e.scheduler(
              true
              /* computedTrigger */
            );
          }
        }
      }
      this._dirty = true;
    });
    this.effect.computed = this;
  }
  _get() {
    if (this._dirty) {
      this._dirty = false;
      return this._value = this.effect.run();
    }
    return this._value;
  }
  get value() {
    trackRefValue(this);
    return toRaw(this)._get();
  }
}
function deferredComputed(getter) {
  return new DeferredComputedRefImpl(getter);
}




/***/ }),

/***/ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTransition: () => (/* binding */ BaseTransition),
/* harmony export */   BaseTransitionPropsValidators: () => (/* binding */ BaseTransitionPropsValidators),
/* harmony export */   Comment: () => (/* binding */ Comment),
/* harmony export */   EffectScope: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.EffectScope),
/* harmony export */   Fragment: () => (/* binding */ Fragment),
/* harmony export */   KeepAlive: () => (/* binding */ KeepAlive),
/* harmony export */   ReactiveEffect: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect),
/* harmony export */   Static: () => (/* binding */ Static),
/* harmony export */   Suspense: () => (/* binding */ Suspense),
/* harmony export */   Teleport: () => (/* binding */ Teleport),
/* harmony export */   Text: () => (/* binding */ Text),
/* harmony export */   assertNumber: () => (/* binding */ assertNumber),
/* harmony export */   callWithAsyncErrorHandling: () => (/* binding */ callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* binding */ callWithErrorHandling),
/* harmony export */   camelize: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize),
/* harmony export */   capitalize: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize),
/* harmony export */   cloneVNode: () => (/* binding */ cloneVNode),
/* harmony export */   compatUtils: () => (/* binding */ compatUtils),
/* harmony export */   computed: () => (/* binding */ computed),
/* harmony export */   createBlock: () => (/* binding */ createBlock),
/* harmony export */   createCommentVNode: () => (/* binding */ createCommentVNode),
/* harmony export */   createElementBlock: () => (/* binding */ createElementBlock),
/* harmony export */   createElementVNode: () => (/* binding */ createBaseVNode),
/* harmony export */   createHydrationRenderer: () => (/* binding */ createHydrationRenderer),
/* harmony export */   createPropsRestProxy: () => (/* binding */ createPropsRestProxy),
/* harmony export */   createRenderer: () => (/* binding */ createRenderer),
/* harmony export */   createSlots: () => (/* binding */ createSlots),
/* harmony export */   createStaticVNode: () => (/* binding */ createStaticVNode),
/* harmony export */   createTextVNode: () => (/* binding */ createTextVNode),
/* harmony export */   createVNode: () => (/* binding */ createVNode),
/* harmony export */   customRef: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.customRef),
/* harmony export */   defineAsyncComponent: () => (/* binding */ defineAsyncComponent),
/* harmony export */   defineComponent: () => (/* binding */ defineComponent),
/* harmony export */   defineEmits: () => (/* binding */ defineEmits),
/* harmony export */   defineExpose: () => (/* binding */ defineExpose),
/* harmony export */   defineModel: () => (/* binding */ defineModel),
/* harmony export */   defineOptions: () => (/* binding */ defineOptions),
/* harmony export */   defineProps: () => (/* binding */ defineProps),
/* harmony export */   defineSlots: () => (/* binding */ defineSlots),
/* harmony export */   devtools: () => (/* binding */ devtools),
/* harmony export */   effect: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.effect),
/* harmony export */   effectScope: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.effectScope),
/* harmony export */   getCurrentInstance: () => (/* binding */ getCurrentInstance),
/* harmony export */   getCurrentScope: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope),
/* harmony export */   getTransitionRawChildren: () => (/* binding */ getTransitionRawChildren),
/* harmony export */   guardReactiveProps: () => (/* binding */ guardReactiveProps),
/* harmony export */   h: () => (/* binding */ h),
/* harmony export */   handleError: () => (/* binding */ handleError),
/* harmony export */   hasInjectionContext: () => (/* binding */ hasInjectionContext),
/* harmony export */   initCustomFormatter: () => (/* binding */ initCustomFormatter),
/* harmony export */   inject: () => (/* binding */ inject),
/* harmony export */   isMemoSame: () => (/* binding */ isMemoSame),
/* harmony export */   isProxy: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isProxy),
/* harmony export */   isReactive: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef),
/* harmony export */   isRuntimeOnly: () => (/* binding */ isRuntimeOnly),
/* harmony export */   isShallow: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isShallow),
/* harmony export */   isVNode: () => (/* binding */ isVNode),
/* harmony export */   markRaw: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.markRaw),
/* harmony export */   mergeDefaults: () => (/* binding */ mergeDefaults),
/* harmony export */   mergeModels: () => (/* binding */ mergeModels),
/* harmony export */   mergeProps: () => (/* binding */ mergeProps),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   normalizeClass: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeClass),
/* harmony export */   normalizeProps: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeProps),
/* harmony export */   normalizeStyle: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeStyle),
/* harmony export */   onActivated: () => (/* binding */ onActivated),
/* harmony export */   onBeforeMount: () => (/* binding */ onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* binding */ onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* binding */ onBeforeUpdate),
/* harmony export */   onDeactivated: () => (/* binding */ onDeactivated),
/* harmony export */   onErrorCaptured: () => (/* binding */ onErrorCaptured),
/* harmony export */   onMounted: () => (/* binding */ onMounted),
/* harmony export */   onRenderTracked: () => (/* binding */ onRenderTracked),
/* harmony export */   onRenderTriggered: () => (/* binding */ onRenderTriggered),
/* harmony export */   onScopeDispose: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.onScopeDispose),
/* harmony export */   onServerPrefetch: () => (/* binding */ onServerPrefetch),
/* harmony export */   onUnmounted: () => (/* binding */ onUnmounted),
/* harmony export */   onUpdated: () => (/* binding */ onUpdated),
/* harmony export */   openBlock: () => (/* binding */ openBlock),
/* harmony export */   popScopeId: () => (/* binding */ popScopeId),
/* harmony export */   provide: () => (/* binding */ provide),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.proxyRefs),
/* harmony export */   pushScopeId: () => (/* binding */ pushScopeId),
/* harmony export */   queuePostFlushCb: () => (/* binding */ queuePostFlushCb),
/* harmony export */   reactive: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref),
/* harmony export */   registerRuntimeCompiler: () => (/* binding */ registerRuntimeCompiler),
/* harmony export */   renderList: () => (/* binding */ renderList),
/* harmony export */   renderSlot: () => (/* binding */ renderSlot),
/* harmony export */   resolveComponent: () => (/* binding */ resolveComponent),
/* harmony export */   resolveDirective: () => (/* binding */ resolveDirective),
/* harmony export */   resolveDynamicComponent: () => (/* binding */ resolveDynamicComponent),
/* harmony export */   resolveFilter: () => (/* binding */ resolveFilter),
/* harmony export */   resolveTransitionHooks: () => (/* binding */ resolveTransitionHooks),
/* harmony export */   setBlockTracking: () => (/* binding */ setBlockTracking),
/* harmony export */   setDevtoolsHook: () => (/* binding */ setDevtoolsHook),
/* harmony export */   setTransitionHooks: () => (/* binding */ setTransitionHooks),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowRef),
/* harmony export */   ssrContextKey: () => (/* binding */ ssrContextKey),
/* harmony export */   ssrUtils: () => (/* binding */ ssrUtils),
/* harmony export */   stop: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.stop),
/* harmony export */   toDisplayString: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.toDisplayString),
/* harmony export */   toHandlerKey: () => (/* reexport safe */ _vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey),
/* harmony export */   toHandlers: () => (/* binding */ toHandlers),
/* harmony export */   toRaw: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRefs),
/* harmony export */   toValue: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toValue),
/* harmony export */   transformVNodeArgs: () => (/* binding */ transformVNodeArgs),
/* harmony export */   triggerRef: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.triggerRef),
/* harmony export */   unref: () => (/* reexport safe */ _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.unref),
/* harmony export */   useAttrs: () => (/* binding */ useAttrs),
/* harmony export */   useModel: () => (/* binding */ useModel),
/* harmony export */   useSSRContext: () => (/* binding */ useSSRContext),
/* harmony export */   useSlots: () => (/* binding */ useSlots),
/* harmony export */   useTransitionState: () => (/* binding */ useTransitionState),
/* harmony export */   version: () => (/* binding */ version),
/* harmony export */   warn: () => (/* binding */ warn),
/* harmony export */   watch: () => (/* binding */ watch),
/* harmony export */   watchEffect: () => (/* binding */ watchEffect),
/* harmony export */   watchPostEffect: () => (/* binding */ watchPostEffect),
/* harmony export */   watchSyncEffect: () => (/* binding */ watchSyncEffect),
/* harmony export */   withAsyncContext: () => (/* binding */ withAsyncContext),
/* harmony export */   withCtx: () => (/* binding */ withCtx),
/* harmony export */   withDefaults: () => (/* binding */ withDefaults),
/* harmony export */   withDirectives: () => (/* binding */ withDirectives),
/* harmony export */   withMemo: () => (/* binding */ withMemo),
/* harmony export */   withScopeId: () => (/* binding */ withScopeId)
/* harmony export */ });
/* harmony import */ var _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/reactivity */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");





const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn(msg, ...args) {
  if (false)
    {}
  (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(value)) {
    value = formatProp(key, (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(value);
    return raw ? value : [`${key}=`, value];
  }
}
function assertNumber(val, type) {
  if (false)
    {}
  if (val === void 0) {
    return;
  } else if (typeof val !== "number") {
    warn(`${type} is not a valid number - got ${JSON.stringify(val)}.`);
  } else if (isNaN(val)) {
    warn(`${type} is NaN - the duration expression might be incorrect.`);
  }
}

const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isPromise)(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo =  true ? ErrorTypeStrings[type] : 0;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  if (true) {
    const info = ErrorTypeStrings[type];
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      throw err;
    } else {
      console.error(err);
    }
  } else {}
}

let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  if (true) {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if ( true && checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    if (true) {
      seen = seen || /* @__PURE__ */ new Map();
    }
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if ( true && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  if (true) {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue.sort(comparator);
  const check =  true ? (job) => checkRecursiveUpdates(seen, job) : 0;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if ( true && check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      warn(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}

let isHmrUpdating = false;
const hmrDirtyComponents = /* @__PURE__ */ new Set();
if (true) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)().__VUE_HMR_RUNTIME__ = {
    createRecord: tryWrap(createRecord),
    rerender: tryWrap(rerender),
    reload: tryWrap(reload)
  };
}
const map = /* @__PURE__ */ new Map();
function registerHMR(instance) {
  const id = instance.type.__hmrId;
  let record = map.get(id);
  if (!record) {
    createRecord(id, instance.type);
    record = map.get(id);
  }
  record.instances.add(instance);
}
function unregisterHMR(instance) {
  map.get(instance.type.__hmrId).instances.delete(instance);
}
function createRecord(id, initialDef) {
  if (map.has(id)) {
    return false;
  }
  map.set(id, {
    initialDef: normalizeClassComponent(initialDef),
    instances: /* @__PURE__ */ new Set()
  });
  return true;
}
function normalizeClassComponent(component) {
  return isClassComponent(component) ? component.__vccOpts : component;
}
function rerender(id, newRender) {
  const record = map.get(id);
  if (!record) {
    return;
  }
  record.initialDef.render = newRender;
  [...record.instances].forEach((instance) => {
    if (newRender) {
      instance.render = newRender;
      normalizeClassComponent(instance.type).render = newRender;
    }
    instance.renderCache = [];
    isHmrUpdating = true;
    instance.update();
    isHmrUpdating = false;
  });
}
function reload(id, newComp) {
  const record = map.get(id);
  if (!record)
    return;
  newComp = normalizeClassComponent(newComp);
  updateComponentDef(record.initialDef, newComp);
  const instances = [...record.instances];
  for (const instance of instances) {
    const oldComp = normalizeClassComponent(instance.type);
    if (!hmrDirtyComponents.has(oldComp)) {
      if (oldComp !== record.initialDef) {
        updateComponentDef(oldComp, newComp);
      }
      hmrDirtyComponents.add(oldComp);
    }
    instance.appContext.propsCache.delete(instance.type);
    instance.appContext.emitsCache.delete(instance.type);
    instance.appContext.optionsCache.delete(instance.type);
    if (instance.ceReload) {
      hmrDirtyComponents.add(oldComp);
      instance.ceReload(newComp.styles);
      hmrDirtyComponents.delete(oldComp);
    } else if (instance.parent) {
      queueJob(instance.parent.update);
    } else if (instance.appContext.reload) {
      instance.appContext.reload();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      console.warn(
        "[HMR] Root or manually mounted instance modified. Full reload required."
      );
    }
  }
  queuePostFlushCb(() => {
    for (const instance of instances) {
      hmrDirtyComponents.delete(
        normalizeClassComponent(instance.type)
      );
    }
  });
}
function updateComponentDef(oldComp, newComp) {
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(oldComp, newComp);
  for (const key in oldComp) {
    if (key !== "__file" && !(key in newComp)) {
      delete oldComp[key];
    }
  }
}
function tryWrap(fn) {
  return (id, arg) => {
    try {
      return fn(id, arg);
    } catch (e) {
      console.error(e);
      console.warn(
        `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
      );
    }
  };
}

let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version) {
  emit$1("app:init" /* APP_INIT */, app, version, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
function devtoolsUnmountApp(app) {
  emit$1("app:unmount" /* APP_UNMOUNT */, app);
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added" /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated" /* COMPONENT_UPDATED */);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed" /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      component.parent ? component.parent.uid : void 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start" /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end" /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit" /* COMPONENT_EMIT */,
    component.appContext.app,
    component,
    event,
    params
  );
}

function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
  if (true) {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(event) in propsOptions)) {
          warn(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener = event.startsWith("update:");
  const modelArg = isModelListener && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseToNumber);
    }
  }
  if (true) {
    devtoolsComponentEmit(instance, event, args);
  }
  if (true) {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(lowerCaseEvent)]) {
      warn(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event)}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(event)] || // also try camelCase event handler (#2249)
  props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(event))];
  if (!handler && isModelListener) {
    handler = props[handlerName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(normalized, raw);
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(options, key[0].toLowerCase() + key.slice(1)) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(options, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key)) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(options, key);
}

let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
const withScopeId = (_id) => withCtx;
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    if (true) {
      devtoolsComponentUpdated(ctx);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}

let accessedAttrs = false;
function markAttrsAccessed() {
  accessedAttrs = true;
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  if (true) {
    accessedAttrs = false;
  }
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(
        render.call(
          proxyToUse,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if ( true && attrs === props) {
        markAttrsAccessed();
      }
      result = normalizeVNode(
        render2.length > 1 ? render2(
          props,
           true ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit
          } : 0
        ) : render2(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  let setRoot = void 0;
  if ( true && result.patchFlag > 0 && result.patchFlag & 2048) {
    [root, setRoot] = getChildRoot(result);
  }
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs);
      } else if ( true && !accessedAttrs && root.type !== Comment) {
        const allAttrs = Object.keys(attrs);
        const eventAttrs = [];
        const extraAttrs = [];
        for (let i = 0, l = allAttrs.length; i < l; i++) {
          const key = allAttrs[i];
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
            if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isModelListener)(key)) {
              eventAttrs.push(key[2].toLowerCase() + key.slice(3));
            }
          } else {
            extraAttrs.push(key);
          }
        }
        if (extraAttrs.length) {
          warn(
            `Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.`
          );
        }
        if (eventAttrs.length) {
          warn(
            `Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
          );
        }
      }
    }
  }
  if (vnode.dirs) {
    if ( true && !isElementRoot(root)) {
      warn(
        `Runtime directive used on component with non-element root node. The directives will not function as intended.`
      );
    }
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    if ( true && !isElementRoot(root)) {
      warn(
        `Component inside <Transition> renders non-element root node that cannot be animated.`
      );
    }
    root.transition = vnode.transition;
  }
  if ( true && setRoot) {
    setRoot(root);
  } else {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getChildRoot = (vnode) => {
  const rawChildren = vnode.children;
  const dynamicChildren = vnode.dynamicChildren;
  const childRoot = filterSingleRoot(rawChildren);
  if (!childRoot) {
    return [vnode, void 0];
  }
  const index = rawChildren.indexOf(childRoot);
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
  const setRoot = (updatedRoot) => {
    rawChildren[index] = updatedRoot;
    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot;
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
      }
    }
  };
  return [normalizeVNode(childRoot), setRoot];
};
function filterSingleRoot(children) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isModelListener)(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
const isElementRoot = (vnode) => {
  return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if ( true && (prevChildren || nextChildren) && isHmrUpdating) {
    return true;
  }
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}

const isSuspense = (type) => type.__isSuspense;
const SuspenseImpl = {
  name: "Suspense",
  // In order to make Suspense tree-shakable, we need to avoid importing it
  // directly in the renderer. The renderer checks for the __isSuspense flag
  // on a vnode's type and calls the `process` method, passing in renderer
  // internals.
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    } else {
      patchSuspense(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        isSVG,
        slotScopeIds,
        optimized,
        rendererInternals
      );
    }
  },
  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl ;
function triggerEvent(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
  const {
    p: patch,
    o: { createElement }
  } = rendererInternals;
  const hiddenContainer = createElement("div");
  const suspense = vnode.suspense = createSuspenseBoundary(
    vnode,
    parentSuspense,
    parentComponent,
    container,
    hiddenContainer,
    anchor,
    isSVG,
    slotScopeIds,
    optimized,
    rendererInternals
  );
  patch(
    null,
    suspense.pendingBranch = vnode.ssContent,
    hiddenContainer,
    null,
    parentComponent,
    suspense,
    isSVG,
    slotScopeIds
  );
  if (suspense.deps > 0) {
    triggerEvent(vnode, "onPending");
    triggerEvent(vnode, "onFallback");
    patch(
      null,
      vnode.ssFallback,
      container,
      anchor,
      parentComponent,
      null,
      // fallback tree will not have suspense context
      isSVG,
      slotScopeIds
    );
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve(false, true);
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
  if (pendingBranch) {
    suspense.pendingBranch = newBranch;
    if (isSameVNodeType(newBranch, pendingBranch)) {
      patch(
        pendingBranch,
        newBranch,
        suspense.hiddenContainer,
        null,
        parentComponent,
        suspense,
        isSVG,
        slotScopeIds,
        optimized
      );
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(
          activeBranch,
          newFallback,
          container,
          anchor,
          parentComponent,
          null,
          // fallback tree will not have suspense context
          isSVG,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newFallback);
      }
    } else {
      suspense.pendingId++;
      if (isHydrating) {
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      }
      suspense.deps = 0;
      suspense.effects.length = 0;
      suspense.hiddenContainer = createElement("div");
      if (isInFallback) {
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(
            activeBranch,
            newFallback,
            container,
            anchor,
            parentComponent,
            null,
            // fallback tree will not have suspense context
            isSVG,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        suspense.resolve(true);
      } else {
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      patch(
        activeBranch,
        newBranch,
        container,
        anchor,
        parentComponent,
        suspense,
        isSVG,
        slotScopeIds,
        optimized
      );
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent(n2, "onPending");
      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(
        null,
        newBranch,
        suspense.hiddenContainer,
        null,
        parentComponent,
        suspense,
        isSVG,
        slotScopeIds,
        optimized
      );
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else {
        const { timeout, pendingId } = suspense;
        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}
let hasWarned = false;
function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  if ( true && !hasWarned) {
    hasWarned = true;
    console[console.info ? "info" : "log"](
      `<Suspense> is an experimental feature and its API will likely change.`
    );
  }
  const {
    p: patch,
    m: move,
    um: unmount,
    n: next,
    o: { parentNode, remove }
  } = rendererInternals;
  let parentSuspenseId;
  const isSuspensible = isVNodeSuspensible(vnode);
  if (isSuspensible) {
    if (parentSuspense == null ? void 0 : parentSuspense.pendingBranch) {
      parentSuspenseId = parentSuspense.pendingId;
      parentSuspense.deps++;
    }
  }
  const timeout = vnode.props ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(vnode.props.timeout) : void 0;
  if (true) {
    assertNumber(timeout, `Suspense timeout`);
  }
  const suspense = {
    vnode,
    parent: parentSuspense,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
    isHydrating,
    isUnmounted: false,
    effects: [],
    resolve(resume = false, sync = false) {
      if (true) {
        if (!resume && !suspense.pendingBranch) {
          throw new Error(
            `suspense.resolve() is called without a pending branch.`
          );
        }
        if (suspense.isUnmounted) {
          throw new Error(
            `suspense.resolve() is called on an already unmounted suspense boundary.`
          );
        }
      }
      const {
        vnode: vnode2,
        activeBranch,
        pendingBranch,
        pendingId,
        effects,
        parentComponent: parentComponent2,
        container: container2
      } = suspense;
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container2, anchor2, 0);
            }
          };
        }
        let { anchor: anchor2 } = suspense;
        if (activeBranch) {
          anchor2 = next(activeBranch);
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor2, 0);
        }
      }
      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false;
      let parent = suspense.parent;
      let hasUnresolvedAncestor = false;
      while (parent) {
        if (parent.pendingBranch) {
          parent.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }
        parent = parent.parent;
      }
      if (!hasUnresolvedAncestor) {
        queuePostFlushCb(effects);
      }
      suspense.effects = [];
      if (isSuspensible) {
        if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
          parentSuspense.deps--;
          if (parentSuspense.deps === 0 && !sync) {
            parentSuspense.resolve();
          }
        }
      }
      triggerEvent(vnode2, "onResolve");
    },
    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
      triggerEvent(vnode2, "onFallback");
      const anchor2 = next(activeBranch);
      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        }
        patch(
          null,
          fallbackVNode,
          container2,
          anchor2,
          parentComponent2,
          null,
          // fallback tree will not have suspense context
          isSVG2,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, fallbackVNode);
      };
      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }
      suspense.isInFallback = true;
      unmount(
        activeBranch,
        parentComponent2,
        null,
        // no suspense so unmount hooks fire now
        true
        // shouldRemove
      );
      if (!delayEnter) {
        mountFallback();
      }
    },
    move(container2, anchor2, type) {
      suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
      suspense.container = container2;
    },
    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },
    registerDep(instance, setupRenderEffect) {
      const isInPendingSuspense = !!suspense.pendingBranch;
      if (isInPendingSuspense) {
        suspense.deps++;
      }
      const hydratedEl = instance.vnode.el;
      instance.asyncDep.catch((err) => {
        handleError(err, instance, 0);
      }).then((asyncSetupResult) => {
        if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
          return;
        }
        instance.asyncResolved = true;
        const { vnode: vnode2 } = instance;
        if (true) {
          pushWarningContext(vnode2);
        }
        handleSetupResult(instance, asyncSetupResult, false);
        if (hydratedEl) {
          vnode2.el = hydratedEl;
        }
        const placeholder = !hydratedEl && instance.subTree.el;
        setupRenderEffect(
          instance,
          vnode2,
          // component may have been moved before resolve.
          // if this is not a hydration, instance.subTree will be the comment
          // placeholder.
          parentNode(hydratedEl || instance.subTree.el),
          // anchor will not be used if this is hydration, so only need to
          // consider the comment placeholder case.
          hydratedEl ? null : next(instance.subTree),
          suspense,
          isSVG,
          optimized
        );
        if (placeholder) {
          remove(placeholder);
        }
        updateHOCHostEl(instance, vnode2.el);
        if (true) {
          popWarningContext();
        }
        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },
    unmount(parentSuspense2, doRemove) {
      suspense.isUnmounted = true;
      if (suspense.activeBranch) {
        unmount(
          suspense.activeBranch,
          parentComponent,
          parentSuspense2,
          doRemove
        );
      }
      if (suspense.pendingBranch) {
        unmount(
          suspense.pendingBranch,
          parentComponent,
          parentSuspense2,
          doRemove
        );
      }
    }
  };
  return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(
    vnode,
    parentSuspense,
    parentComponent,
    node.parentNode,
    document.createElement("div"),
    null,
    isSVG,
    slotScopeIds,
    optimized,
    rendererInternals,
    true
    /* hydrating */
  );
  const result = hydrateNode(
    node,
    suspense.pendingBranch = vnode.ssContent,
    parentComponent,
    suspense,
    slotScopeIds,
    optimized
  );
  if (suspense.deps === 0) {
    suspense.resolve(false, true);
  }
  return result;
}
function normalizeSuspenseChildren(vnode) {
  const { shapeFlag, children } = vnode;
  const isSlotChildren = shapeFlag & 32;
  vnode.ssContent = normalizeSuspenseSlot(
    isSlotChildren ? children.default : children
  );
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}
function normalizeSuspenseSlot(s) {
  let block;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(s)) {
    const trackBlock = isBlockTreeEnabled && s._c;
    if (trackBlock) {
      s._d = false;
      openBlock();
    }
    s = s();
    if (trackBlock) {
      s._d = true;
      block = currentBlock;
      closeBlock();
    }
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(s)) {
    const singleChild = filterSingleRoot(s);
    if ( true && !singleChild) {
      warn(`<Suspense> slots expect a single root node.`);
    }
    s = singleChild;
  }
  s = normalizeVNode(s);
  if (block && !s.dynamicChildren) {
    s.dynamicChildren = block.filter((c) => c !== s);
  }
  return s;
}
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const { vnode, parentComponent } = suspense;
  const el = vnode.el = branch.el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}
function isVNodeSuspensible(vnode) {
  var _a;
  return ((_a = vnode.props) == null ? void 0 : _a.suspensible) != null && vnode.props.suspensible !== false;
}

function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
function watchPostEffect(effect, options) {
  return doWatch(
    effect,
    null,
     true ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, options, { flush: "post" }) : 0
  );
}
function watchSyncEffect(effect, options) {
  return doWatch(
    effect,
    null,
     true ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, options, { flush: "sync" }) : 0
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(cb)) {
    warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ) {
  var _a;
  if ( true && !cb) {
    if (immediate !== void 0) {
      warn(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s) => {
    warn(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope)() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(source)) {
    getter = () => source.value;
    forceTrigger = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isShallow)(source);
  } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReactive)(source)) {
    getter = () => source;
    deep = true;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReactive)(s) || (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isShallow)(s));
    getter = () => source.map((s) => {
      if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(s)) {
        return s.value;
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReactive)(s)) {
        return traverse(s);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else {
         true && warnInvalidSource(s);
      }
    });
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP;
     true && warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some(
        (v, i) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasChanged)(v, oldValue[i])
      ) : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasChanged)(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect(getter, scheduler);
  if (true) {
    effect.onTrack = onTrack;
    effect.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.remove)(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(value)) {
    traverse(value.value, seen);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isMap)(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}

function validateDirectiveName(name) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isBuiltInDirective)(name)) {
    warn("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
     true && warn(`withDirectives can only be used inside render functions.`);
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ] = directives[i];
    if (dir) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
    }
  }
}

function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        let hasFound = false;
        for (const c of children) {
          if (c.type !== Comment) {
            if ( true && hasFound) {
              warn(
                "<transition> can only be used on a single element or component. Use <transition-group> for lists."
              );
              break;
            }
            child = c;
            hasFound = true;
            if (false)
              {}
          }
        }
      }
      const rawProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(props);
      const { mode } = rawProps;
      if ( true && mode && mode !== "in-out" && mode !== "out-in" && mode !== "default") {
        warn(`invalid <transition> mode: ${mode}`);
      }
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook(hook, args);
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook(cancelHook, [el]);
        } else {
          callHook(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove();
      }
      callHook(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove();
        if (cancelled) {
          callHook(onLeaveCancelled, [el]);
        } else {
          callHook(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}

function defineComponent(options, extraOptions) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}

const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
function defineAsyncComponent(source) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(source)) {
    source = { loader: source };
  }
  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
    timeout,
    // undefined = never times out
    suspensible = true,
    onError: userOnError
  } = source;
  let pendingRequest = null;
  let resolvedComp;
  let retries = 0;
  const retry = () => {
    retries++;
    pendingRequest = null;
    return load();
  };
  const load = () => {
    let thisRequest;
    return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
      err = err instanceof Error ? err : new Error(String(err));
      if (userOnError) {
        return new Promise((resolve, reject) => {
          const userRetry = () => resolve(retry());
          const userFail = () => reject(err);
          userOnError(err, userRetry, userFail, retries + 1);
        });
      } else {
        throw err;
      }
    }).then((comp) => {
      if (thisRequest !== pendingRequest && pendingRequest) {
        return pendingRequest;
      }
      if ( true && !comp) {
        warn(
          `Async component loader resolved to undefined. If you are using retry(), make sure to return its return value.`
        );
      }
      if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
        comp = comp.default;
      }
      if ( true && comp && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(comp) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(comp)) {
        throw new Error(`Invalid async component load result: ${comp}`);
      }
      resolvedComp = comp;
      return comp;
    }));
  };
  return defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: load,
    get __asyncResolved() {
      return resolvedComp;
    },
    setup() {
      const instance = currentInstance;
      if (resolvedComp) {
        return () => createInnerComp(resolvedComp, instance);
      }
      const onError = (err) => {
        pendingRequest = null;
        handleError(
          err,
          instance,
          13,
          !errorComponent
          /* do not throw in dev if user provided error component */
        );
      };
      if (suspensible && instance.suspense || isInSSRComponentSetup) {
        return load().then((comp) => {
          return () => createInnerComp(comp, instance);
        }).catch((err) => {
          onError(err);
          return () => errorComponent ? createVNode(errorComponent, {
            error: err
          }) : null;
        });
      }
      const loaded = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)(false);
      const error = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)();
      const delayed = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)(!!delay);
      if (delay) {
        setTimeout(() => {
          delayed.value = false;
        }, delay);
      }
      if (timeout != null) {
        setTimeout(() => {
          if (!loaded.value && !error.value) {
            const err = new Error(
              `Async component timed out after ${timeout}ms.`
            );
            onError(err);
            error.value = err;
          }
        }, timeout);
      }
      load().then(() => {
        loaded.value = true;
        if (instance.parent && isKeepAlive(instance.parent.vnode)) {
          queueJob(instance.parent.update);
        }
      }).catch((err) => {
        onError(err);
        error.value = err;
      });
      return () => {
        if (loaded.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value
          });
        } else if (loadingComponent && !delayed.value) {
          return createVNode(loadingComponent);
        }
      };
    }
  });
}
function createInnerComp(comp, parent) {
  const { ref: ref2, props, children, ce } = parent.vnode;
  const vnode = createVNode(comp, props, children);
  vnode.ref = ref2;
  vnode.ce = ce;
  delete parent.vnode.ce;
  return vnode;
}

const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
const KeepAliveImpl = {
  name: `KeepAlive`,
  // Marker for special handling inside the renderer. We are not using a ===
  // check directly on KeepAlive in the renderer, because importing it directly
  // would prevent it from being tree-shaken.
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const sharedContext = instance.ctx;
    if (!sharedContext.renderer) {
      return () => {
        const children = slots.default && slots.default();
        return children && children.length === 1 ? children[0] : children;
      };
    }
    const cache = /* @__PURE__ */ new Map();
    const keys = /* @__PURE__ */ new Set();
    let current = null;
    if (true) {
      instance.__v_cache = cache;
    }
    const parentSuspense = instance.suspense;
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement }
      }
    } = sharedContext;
    const storageContainer = createElement("div");
    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance2 = vnode.component;
      move(vnode, container, anchor, 0, parentSuspense);
      patch(
        instance2.vnode,
        vnode,
        container,
        anchor,
        instance2,
        parentSuspense,
        isSVG,
        vnode.slotScopeIds,
        optimized
      );
      queuePostRenderEffect(() => {
        instance2.isDeactivated = false;
        if (instance2.a) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(instance2.a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
      }, parentSuspense);
      if (true) {
        devtoolsComponentAdded(instance2);
      }
    };
    sharedContext.deactivate = (vnode) => {
      const instance2 = vnode.component;
      move(vnode, storageContainer, null, 1, parentSuspense);
      queuePostRenderEffect(() => {
        if (instance2.da) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(instance2.da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
        instance2.isDeactivated = true;
      }, parentSuspense);
      if (true) {
        devtoolsComponentAdded(instance2);
      }
    };
    function unmount(vnode) {
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense, true);
    }
    function pruneCache(filter) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type);
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key);
        }
      });
    }
    function pruneCacheEntry(key) {
      const cached = cache.get(key);
      if (!current || !isSameVNodeType(cached, current)) {
        unmount(cached);
      } else if (current) {
        resetShapeFlag(current);
      }
      cache.delete(key);
      keys.delete(key);
    }
    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache((name) => matches(include, name));
        exclude && pruneCache((name) => !matches(exclude, name));
      },
      // prune post-render after `current` has been updated
      { flush: "post", deep: true }
    );
    let pendingCacheKey = null;
    const cacheSubtree = () => {
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };
    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(() => {
      cache.forEach((cached) => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type && cached.key === vnode.key) {
          resetShapeFlag(vnode);
          const da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }
        unmount(cached);
      });
    });
    return () => {
      pendingCacheKey = null;
      if (!slots.default) {
        return null;
      }
      const children = slots.default();
      const rawVNode = children[0];
      if (children.length > 1) {
        if (true) {
          warn(`KeepAlive should contain exactly one component child.`);
        }
        current = null;
        return children;
      } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
        current = null;
        return rawVNode;
      }
      let vnode = getInnerChild(rawVNode);
      const comp = vnode.type;
      const name = getComponentName(
        isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
      );
      const { include, exclude, max } = props;
      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
        current = vnode;
        return rawVNode;
      }
      const key = vnode.key == null ? comp : vnode.key;
      const cachedVNode = cache.get(key);
      if (vnode.el) {
        vnode = cloneVNode(vnode);
        if (rawVNode.shapeFlag & 128) {
          rawVNode.ssContent = vnode;
        }
      }
      pendingCacheKey = key;
      if (cachedVNode) {
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;
        if (vnode.transition) {
          setTransitionHooks(vnode, vnode.transition);
        }
        vnode.shapeFlag |= 512;
        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key);
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      }
      vnode.shapeFlag |= 256;
      current = vnode;
      return isSuspense(rawVNode.type) ? rawVNode : vnode;
    };
  }
};
const KeepAlive = KeepAliveImpl;
function matches(pattern, name) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(pattern)) {
    return pattern.some((p) => matches(p, name));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(pattern)) {
    return pattern.split(",").includes(name);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isRegExp)(pattern)) {
    return pattern.test(name);
  }
  return false;
}
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.remove)(keepAliveRoot[type], injected);
  }, target);
}
function resetShapeFlag(vnode) {
  vnode.shapeFlag &= ~256;
  vnode.shapeFlag &= ~512;
}
function getInnerChild(vnode) {
  return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
}

function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else if (true) {
    const apiName = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(ErrorTypeStrings[type].replace(/ hook$/, ""));
    warn(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().` + (` If you are using async setup(), make sure to register lifecycle hooks before the first await statement.` )
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}

const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
        /* do not include inferred name to avoid breaking existing code */
      );
      if (selfName && (selfName === name || selfName === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(name) || selfName === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    if ( true && warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else if (true) {
    warn(
      `resolve${(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize)(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(name)] || registry[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize)((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(name))]);
}

function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(source) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    if ( true && !Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}

function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.key ? (...args) => {
        const res = slot.fn(...args);
        if (res)
          res.key = slot.key;
        return res;
      } : slot.fn;
    }
  }
  return slots;
}

function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if ( true && slot && slot.length > 1) {
    warn(
      `SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template.`
    );
    slot = () => [];
  }
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}

function toHandlers(obj, preserveCaseIfNecessary) {
  const ret = {};
  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(obj)) {
    warn(`v-on with no argument expects an object value.`);
    return ret;
  }
  for (const key in obj) {
    ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toHandlerKey)(key)] = obj[key];
  }
  return ret;
}

const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(i.props) : 0,
    $attrs: (i) =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(i.attrs) : 0,
    $slots: (i) =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(i.slots) : 0,
    $refs: (i) =>  true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(i.refs) : 0,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) =>  true ? resolveMergedOptions(i) : 0,
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) =>  true ? instanceWatch.bind(i) : 0
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && !state.__isScriptSetup && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if ( true && key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1 /* SETUP */:
            return setupState[key];
          case 2 /* DATA */:
            return data[key];
          case 4 /* CONTEXT */:
            return ctx[key];
          case 3 /* PROPS */:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1 /* SETUP */;
        return setupState[key];
      } else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(data, key)) {
        accessCache[key] = 2 /* DATA */;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(normalizedProps, key)
      ) {
        accessCache[key] = 3 /* PROPS */;
        return props[key];
      } else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(ctx, key)) {
        accessCache[key] = 4 /* CONTEXT */;
        return ctx[key];
      } else if ( false || shouldCacheAccess) {
        accessCache[key] = 0 /* OTHER */;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.track)(instance, "get", key);
         true && markAttrsAccessed();
      } else if ( true && key === "$slots") {
        (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.track)(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(ctx, key)) {
      accessCache[key] = 4 /* CONTEXT */;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if ( true && currentRenderingInstance && (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && isReservedPrefix(key[0]) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(data, key)) {
        warn(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if ( true && setupState.__isScriptSetup && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(setupState, key)) {
      warn(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(data, key)) {
      data[key] = value;
      return true;
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(instance.props, key)) {
       true && warn(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
       true && warn(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if ( true && key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(normalizedProps, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(ctx, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(publicPropertiesMap, key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
if (true) {
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(
  {},
  PublicInstanceProxyHandlers,
  {
    get(target, key) {
      if (key === Symbol.unscopables) {
        return;
      }
      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
      const has = key[0] !== "_" && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isGloballyWhitelisted)(key);
      if ( true && !has && PublicInstanceProxyHandlers.has(_, key)) {
        warn(
          `Property ${JSON.stringify(
            key
          )} should not start with _ which is a reserved prefix for Vue internals.`
        );
      }
      return has;
    }
  }
);
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP
      });
    }
  });
}

const warnRuntimeUsage = (method) => warn(
  `${method}() is a compiler-hint helper that is only usable inside <script setup> of a single file component. Its arguments should be compiled away and passing it at runtime has no effect.`
);
function defineProps() {
  if (true) {
    warnRuntimeUsage(`defineProps`);
  }
  return null;
}
function defineEmits() {
  if (true) {
    warnRuntimeUsage(`defineEmits`);
  }
  return null;
}
function defineExpose(exposed) {
  if (true) {
    warnRuntimeUsage(`defineExpose`);
  }
}
function defineOptions(options) {
  if (true) {
    warnRuntimeUsage(`defineOptions`);
  }
}
function defineSlots() {
  if (true) {
    warnRuntimeUsage(`defineSlots`);
  }
  return null;
}
function defineModel() {
  if (true) {
    warnRuntimeUsage("defineModel");
  }
}
function withDefaults(props, defaults) {
  if (true) {
    warnRuntimeUsage(`withDefaults`);
  }
  return null;
}
function useSlots() {
  return getContext().slots;
}
function useAttrs() {
  return getContext().attrs;
}
function useModel(props, name, options) {
  const i = getCurrentInstance();
  if ( true && !i) {
    warn(`useModel() called without active instance.`);
    return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)();
  }
  if ( true && !i.propsOptions[0][name]) {
    warn(`useModel() called with prop "${name}" which is not declared.`);
    return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)();
  }
  if (options && options.local) {
    const proxy = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ref)(props[name]);
    watch(
      () => props[name],
      (v) => proxy.value = v
    );
    watch(proxy, (value) => {
      if (value !== props[name]) {
        i.emit(`update:${name}`, value);
      }
    });
    return proxy;
  } else {
    return {
      __v_isRef: true,
      get value() {
        return props[name];
      },
      set value(value) {
        i.emit(`update:${name}`, value);
      }
    };
  }
}
function getContext() {
  const i = getCurrentInstance();
  if ( true && !i) {
    warn(`useContext() called without active instance.`);
  }
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(props) ? props.reduce(
    (normalized, p) => (normalized[p] = null, normalized),
    {}
  ) : props;
}
function mergeDefaults(raw, defaults) {
  const props = normalizePropsOrEmits(raw);
  for (const key in defaults) {
    if (key.startsWith("__skip"))
      continue;
    let opt = props[key];
    if (opt) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(opt) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt)) {
        opt = props[key] = { type: opt, default: defaults[key] };
      } else {
        opt.default = defaults[key];
      }
    } else if (opt === null) {
      opt = props[key] = { default: defaults[key] };
    } else if (true) {
      warn(`props default key "${key}" has no corresponding declaration.`);
    }
    if (opt && defaults[`__skip_${key}`]) {
      opt.skipFactory = true;
    }
  }
  return props;
}
function mergeModels(a, b) {
  if (!a || !b)
    return a || b;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(a) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(b))
    return a.concat(b);
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
}
function createPropsRestProxy(props, excludedKeys) {
  const ret = {};
  for (const key in props) {
    if (!excludedKeys.includes(key)) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        get: () => props[key]
      });
    }
  }
  return ret;
}
function withAsyncContext(getAwaitable) {
  const ctx = getCurrentInstance();
  if ( true && !ctx) {
    warn(
      `withAsyncContext called without active current instance. This is likely a bug.`
    );
  }
  let awaitable = getAwaitable();
  unsetCurrentInstance();
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isPromise)(awaitable)) {
    awaitable = awaitable.catch((e) => {
      setCurrentInstance(ctx);
      throw e;
    });
  }
  return [awaitable, () => setCurrentInstance(ctx)];
}

function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties =  true ? createDuplicateChecker() : 0;
  if (true) {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props" /* PROPS */, key);
      }
    }
  }
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(methodHandler)) {
        if (true) {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        } else {}
        if (true) {
          checkDuplicateProperties("Methods" /* METHODS */, key);
        }
      } else if (true) {
        warn(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(dataOptions)) {
      warn(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if ( true && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isPromise)(data)) {
      warn(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(data)) {
       true && warn(`data() should return an object.`);
    } else {
      instance.data = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.reactive)(data);
      if (true) {
        for (const key in data) {
          checkDuplicateProperties("Data" /* DATA */, key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt) ? opt.bind(publicThis, publicThis) : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt.get) ? opt.get.bind(publicThis, publicThis) : _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP;
      if ( true && get === _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP) {
        warn(`Computed property "${key}" has no getter.`);
      }
      const set = !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt.set) ? opt.set.bind(publicThis) :  true ? () => {
        warn(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      } : 0;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
      if (true) {
        checkDuplicateProperties("Computed" /* COMPUTED */, key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    if (true) {
      checkDuplicateProperties("Inject" /* INJECT */, key);
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(raw)) {
    const handler = ctx[raw];
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(handler)) {
      watch(getter, handler);
    } else if (true) {
      warn(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(raw)) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(handler)) {
        watch(getter, handler, raw);
      } else if (true) {
        warn(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else if (true) {
    warn(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
       true && warn(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend))(
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(to) ? to.call(this, this) : to,
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(to) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}

function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(rootComponent)) {
      rootComponent = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, rootComponent);
    }
    if (rootProps != null && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(rootProps)) {
       true && warn(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    if (true) {
      Object.defineProperty(context.config, "unwrapInjectedRef", {
        get() {
          return true;
        },
        set() {
          warn(
            `app.config.unwrapInjectedRef has been deprecated. 3.3 now alawys unwraps injected refs in Options API.`
          );
        }
      });
    }
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        if (true) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) {
           true && warn(`Plugin has already been applied to target app.`);
        } else if (plugin && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else if (true) {
          warn(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        if (true) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else if (true) {
            warn(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        } else {}
        return app;
      },
      component(name, component) {
        if (true) {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if ( true && context.components[name]) {
          warn(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (true) {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if ( true && context.directives[name]) {
          warn(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          if ( true && rootContainer.__vue_app__) {
            warn(
              `There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`
            );
          }
          const vnode = createVNode(
            rootComponent,
            rootProps
          );
          vnode.appContext = context;
          if (true) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer, isSVG);
            };
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          if (true) {
            app._instance = vnode.component;
            devtoolsInitApp(app, version);
          }
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        } else if (true) {
          warn(
            `App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``
          );
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          if (true) {
            app._instance = null;
            devtoolsUnmountApp(app);
          }
          delete app._container.__vue_app__;
        } else if (true) {
          warn(`Cannot unmount an app that is not mounted.`);
        }
      },
      provide(key, value) {
        if ( true && key in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app;
  };
}
let currentApp = null;

function provide(key, value) {
  if (!currentInstance) {
    if (true) {
      warn(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else if (true) {
      warn(`injection "${String(key)}" not found.`);
    }
  } else if (true) {
    warn(`inject() can only be used inside setup() or functional components.`);
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}

function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.def)(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (true) {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReactive)(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
  while (instance) {
    if (instance.type.__hmrId)
      return true;
    instance = instance.parent;
  }
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !( true && isInHmrContext(instance)) && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key)) === key || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.trigger)(instance, "set", "$attrs");
  }
  if (true) {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isReservedProp)(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(options, camelKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(props);
    const castValues = rawCastValues || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0 /* shouldCast */]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1 /* shouldCastTrue */] && (value === "" || value === (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(comp)) {
      cache.set(comp, _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR);
    }
    return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR;
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(raw[i])) {
        warn(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if ( true && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(raw)) {
      warn(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(opt) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(opt) ? { type: opt } : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0 /* shouldCast */] = booleanIndex > -1;
          prop[1 /* shouldCastTrue */] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  } else if (true) {
    warn(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp(
      key,
      resolvedValues[key],
      opt,
      !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(rawProps, key) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(rawProps, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key))
    );
  }
}
function validateProp(name, value, prop, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value)) {
    warn('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.makeMap)(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t = typeof value;
    valid = t === expectedType.toLowerCase();
    if (!valid && t === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(value);
  } else if (expectedType === "Array") {
    valid = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toRawType)(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}

const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if ( true && currentInstance) {
      warn(
        `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
      );
    }
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      if (true) {
        warn(
          `Non-function value encountered for slot "${key}". Prefer function slots for better performance.`
        );
      }
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  if ( true && !isKeepAlive(instance.vnode) && true) {
    warn(
      `Non-function value encountered for default slot. Prefer function slots for better performance.`
    );
  }
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(children);
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.def)(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.def)(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if ( true && isHmrUpdating) {
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(slots, children);
        (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.trigger)(instance, "set", "$slots");
      } else if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};

function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref } = rawRef;
  if ( true && !owner) {
    warn(
      `Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`
    );
    return;
  }
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(oldRef)) {
      refs[oldRef] = null;
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(oldRef)) {
      oldRef.value = null;
    }
  }
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(ref)) {
    callWithErrorHandling(ref, owner, 12, [value, refs]);
  } else {
    const _isString = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(ref);
    const _isRef = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(ref);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(setupState, ref) ? setupState[ref] : refs[ref] : ref.value;
          if (isUnmount) {
            (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(existing) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.remove)(existing, refValue);
          } else {
            if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(existing)) {
              if (_isString) {
                refs[ref] = [refValue];
                if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(setupState, ref)) {
                  setupState[ref] = refs[ref];
                }
              } else {
                ref.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref] = value;
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasOwn)(setupState, ref)) {
            setupState[ref] = value;
          }
        } else if (_isRef) {
          ref.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else if (true) {
          warn("Invalid template ref type:", ref, `(${typeof ref})`);
        }
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    } else if (true) {
      warn("Invalid template ref type:", ref, `(${typeof ref})`);
    }
  }
}

let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
const isComment = (node) => node.nodeType === 8 /* COMMENT */;
function createHydrationFunctions(rendererInternals) {
  const {
    mt: mountComponent,
    p: patch,
    o: {
      patchProp,
      createText,
      nextSibling,
      parentNode,
      remove,
      insert,
      createComment
    }
  } = rendererInternals;
  const hydrate = (vnode, container) => {
    if (!container.hasChildNodes()) {
       true && warn(
        `Attempting to hydrate existing markup but container is empty. Performing full mount instead.`
      );
      patch(null, vnode, container);
      flushPostFlushCbs();
      container._vnode = vnode;
      return;
    }
    hasMismatch = false;
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();
    container._vnode = vnode;
    if (hasMismatch && true) {
      console.error(`Hydration completed but contains mismatches.`);
    }
  };
  const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
    const isFragmentStart = isComment(node) && node.data === "[";
    const onMismatch = () => handleMismatch(
      node,
      vnode,
      parentComponent,
      parentSuspense,
      slotScopeIds,
      isFragmentStart
    );
    const { type, ref, shapeFlag, patchFlag } = vnode;
    let domType = node.nodeType;
    vnode.el = node;
    if (patchFlag === -2) {
      optimized = false;
      vnode.dynamicChildren = null;
    }
    let nextNode = null;
    switch (type) {
      case Text:
        if (domType !== 3 /* TEXT */) {
          if (vnode.children === "") {
            insert(vnode.el = createText(""), parentNode(node), node);
            nextNode = node;
          } else {
            nextNode = onMismatch();
          }
        } else {
          if (node.data !== vnode.children) {
            hasMismatch = true;
             true && warn(
              `Hydration text mismatch:
- Client: ${JSON.stringify(node.data)}
- Server: ${JSON.stringify(vnode.children)}`
            );
            node.data = vnode.children;
          }
          nextNode = nextSibling(node);
        }
        break;
      case Comment:
        if (domType !== 8 /* COMMENT */ || isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = nextSibling(node);
        }
        break;
      case Static:
        if (isFragmentStart) {
          node = nextSibling(node);
          domType = node.nodeType;
        }
        if (domType === 1 /* ELEMENT */ || domType === 3 /* TEXT */) {
          nextNode = node;
          const needToAdoptContent = !vnode.children.length;
          for (let i = 0; i < vnode.staticCount; i++) {
            if (needToAdoptContent)
              vnode.children += nextNode.nodeType === 1 /* ELEMENT */ ? nextNode.outerHTML : nextNode.data;
            if (i === vnode.staticCount - 1) {
              vnode.anchor = nextNode;
            }
            nextNode = nextSibling(nextNode);
          }
          return isFragmentStart ? nextSibling(nextNode) : nextNode;
        } else {
          onMismatch();
        }
        break;
      case Fragment:
        if (!isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = hydrateFragment(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
        break;
      default:
        if (shapeFlag & 1) {
          if (domType !== 1 /* ELEMENT */ || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateElement(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
        } else if (shapeFlag & 6) {
          vnode.slotScopeIds = slotScopeIds;
          const container = parentNode(node);
          mountComponent(
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVGContainer(container),
            optimized
          );
          nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
          if (nextNode && isComment(nextNode) && nextNode.data === "teleport end") {
            nextNode = nextSibling(nextNode);
          }
          if (isAsyncWrapper(vnode)) {
            let subTree;
            if (isFragmentStart) {
              subTree = createVNode(Fragment);
              subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
            } else {
              subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
            }
            subTree.el = node;
            vnode.component.subTree = subTree;
          }
        } else if (shapeFlag & 64) {
          if (domType !== 8 /* COMMENT */) {
            nextNode = onMismatch();
          } else {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateChildren
            );
          }
        } else if (shapeFlag & 128) {
          nextNode = vnode.type.hydrate(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            isSVGContainer(parentNode(node)),
            slotScopeIds,
            optimized,
            rendererInternals,
            hydrateNode
          );
        } else if (true) {
          warn("Invalid HostVNode type:", type, `(${typeof type})`);
        }
    }
    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode);
    }
    return nextNode;
  };
  const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const { type, props, patchFlag, shapeFlag, dirs } = vnode;
    const forcePatchValue = type === "input" && dirs || type === "option";
    if (true) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        if (forcePatchValue || !optimized || patchFlag & (16 | 32)) {
          for (const key in props) {
            if (forcePatchValue && key.endsWith("value") || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isReservedProp)(key)) {
              patchProp(
                el,
                key,
                null,
                props[key],
                false,
                void 0,
                parentComponent
              );
            }
          }
        } else if (props.onClick) {
          patchProp(
            el,
            "onClick",
            null,
            props.onClick,
            false,
            void 0,
            parentComponent
          );
        }
      }
      let vnodeHooks;
      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
      if (shapeFlag & 16 && // skip if element has innerHTML / textContent
      !(props && (props.innerHTML || props.textContent))) {
        let next = hydrateChildren(
          el.firstChild,
          vnode,
          el,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        let hasWarned = false;
        while (next) {
          hasMismatch = true;
          if ( true && !hasWarned) {
            warn(
              `Hydration children mismatch in <${vnode.type}>: server rendered element contains more child nodes than client vdom.`
            );
            hasWarned = true;
          }
          const cur = next;
          next = next.nextSibling;
          remove(cur);
        }
      } else if (shapeFlag & 8) {
        if (el.textContent !== vnode.children) {
          hasMismatch = true;
           true && warn(
            `Hydration text content mismatch in <${vnode.type}>:
- Client: ${el.textContent}
- Server: ${vnode.children}`
          );
          el.textContent = vnode.children;
        }
      }
    }
    return el.nextSibling;
  };
  const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!parentVNode.dynamicChildren;
    const children = parentVNode.children;
    const l = children.length;
    let hasWarned = false;
    for (let i = 0; i < l; i++) {
      const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
      if (node) {
        node = hydrateNode(
          node,
          vnode,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      } else if (vnode.type === Text && !vnode.children) {
        continue;
      } else {
        hasMismatch = true;
        if ( true && !hasWarned) {
          warn(
            `Hydration children mismatch in <${container.tagName.toLowerCase()}>: server rendered element contains fewer child nodes than client vdom.`
          );
          hasWarned = true;
        }
        patch(
          null,
          vnode,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVGContainer(container),
          slotScopeIds
        );
      }
    }
    return node;
  };
  const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    const { slotScopeIds: fragmentSlotScopeIds } = vnode;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    const container = parentNode(node);
    const next = hydrateChildren(
      nextSibling(node),
      vnode,
      container,
      parentComponent,
      parentSuspense,
      slotScopeIds,
      optimized
    );
    if (next && isComment(next) && next.data === "]") {
      return nextSibling(vnode.anchor = next);
    } else {
      hasMismatch = true;
      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };
  const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    hasMismatch = true;
     true && warn(
      `Hydration node mismatch:
- Client vnode:`,
      vnode.type,
      `
- Server rendered DOM:`,
      node,
      node.nodeType === 3 /* TEXT */ ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``
    );
    vnode.el = null;
    if (isFragment) {
      const end = locateClosingAsyncAnchor(node);
      while (true) {
        const next2 = nextSibling(node);
        if (next2 && next2 !== end) {
          remove(next2);
        } else {
          break;
        }
      }
    }
    const next = nextSibling(node);
    const container = parentNode(node);
    remove(node);
    patch(
      null,
      vnode,
      container,
      next,
      parentComponent,
      parentSuspense,
      isSVGContainer(container),
      slotScopeIds
    );
    return next;
  };
  const locateClosingAsyncAnchor = (node) => {
    let match = 0;
    while (node) {
      node = nextSibling(node);
      if (node && isComment(node)) {
        if (node.data === "[")
          match++;
        if (node.data === "]") {
          if (match === 0) {
            return nextSibling(node);
          } else {
            match--;
          }
        }
      }
    }
    return node;
  };
  return [hydrate, hydrateNode];
}

let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  if (true) {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  if (true) {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}

function initFeatureFlags() {
  const needWarn = [];
  if (false) {}
  if (false) {}
  if ( true && needWarn.length) {
    const multi = needWarn.length > 1;
    console.warn(
      `Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}

const queuePostRenderEffect = queueEffectWithSuspense ;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
  return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
  {
    initFeatureFlags();
  }
  const target = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)();
  target.__VUE__ = true;
  if (true) {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized =  true && isHmrUpdating ? false : !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        } else if (true) {
          patchStaticNode(n1, n2, container, isSVG);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (true) {
          warn("Invalid VNode type:", type, `(${typeof type})`);
        }
    }
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    );
  };
  const patchStaticNode = (n1, n2, container, isSVG) => {
    if (n2.children !== n1.children) {
      const anchor = hostNextSibling(n1.anchor);
      removeStaticNode(n1);
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        isSVG
      );
    } else {
      n2.el = n1.el;
      n2.anchor = n1.anchor;
    }
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        isSVG && type !== "foreignObject",
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isReservedProp)(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (true) {
      Object.defineProperty(el, "__vnode", {
        value: vnode,
        enumerable: false
      });
      Object.defineProperty(el, "__vueParentComponent", {
        value: parentComponent,
        enumerable: false
      });
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if ( true && subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
        subTree = filterSingleRoot(subTree.children) || subTree;
      }
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    const newProps = n2.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if ( true && isHmrUpdating) {
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      );
      if (true) {
        traverseStaticChildren(n1, n2);
      }
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isReservedProp)(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isReservedProp)(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if ( true && // #5523 dev root fragment may inherit directives
    (isHmrUpdating || patchFlag & 2048)) {
      patchFlag = 0;
      optimized = false;
      dynamicChildren = null;
    }
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        if (true) {
          traverseStaticChildren(n1, n2);
        } else {}
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    ));
    if ( true && instance.type.__hmrId) {
      registerHMR(instance);
    }
    if (true) {
      pushWarningContext(initialVNode);
      startMeasure(instance, `mount`);
    }
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      if (true) {
        startMeasure(instance, `init`);
      }
      setupComponent(instance);
      if (true) {
        endMeasure(instance, `init`);
      }
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
    if (true) {
      popWarningContext();
      endMeasure(instance, `mount`);
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        if (true) {
          pushWarningContext(n2);
        }
        updateComponentPreRender(instance, n2, optimized);
        if (true) {
          popWarningContext();
        }
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            if (true) {
              startMeasure(instance, `render`);
            }
            instance.subTree = renderComponentRoot(instance);
            if (true) {
              endMeasure(instance, `render`);
            }
            if (true) {
              startMeasure(instance, `hydrate`);
            }
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
            if (true) {
              endMeasure(instance, `hydrate`);
            }
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          if (true) {
            startMeasure(instance, `render`);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          if (true) {
            endMeasure(instance, `render`);
          }
          if (true) {
            startMeasure(instance, `patch`);
          }
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
          );
          if (true) {
            endMeasure(instance, `patch`);
          }
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        if (true) {
          devtoolsComponentAdded(instance);
        }
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        if (true) {
          pushWarningContext(next || instance.vnode);
        }
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        if (true) {
          startMeasure(instance, `render`);
        }
        const nextTree = renderComponentRoot(instance);
        if (true) {
          endMeasure(instance, `render`);
        }
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        if (true) {
          startMeasure(instance, `patch`);
        }
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        if (true) {
          endMeasure(instance, `patch`);
        }
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
        if (true) {
          devtoolsComponentUpdated(instance);
        }
        if (true) {
          popWarningContext();
        }
      }
    };
    const effect = instance.effect = new _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    if (true) {
      effect.onTrack = instance.rtc ? (e) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(instance.rtc, e) : void 0;
      effect.onTrigger = instance.rtg ? (e) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(instance.rtg, e) : void 0;
      update.ownerInstance = instance;
    }
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
    flushPreFlushCbs();
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR;
    c2 = c2 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          if ( true && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            );
          }
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove2 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove2();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove2, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref != null) {
      setRef(ref, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      if ( true && vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
        vnode.children.forEach((child) => {
          if (child.type === Comment) {
            hostRemove(child.el);
          } else {
            remove(child);
          }
        });
      } else {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    if ( true && instance.type.__hmrId) {
      unregisterHMR(instance);
    }
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
    if (true) {
      devtoolsComponentRemoved(instance);
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(ch1) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
      if ( true && c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}

const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(targetSelector)) {
    if (!select) {
       true && warn(
        `Current renderer does not support string target for Teleports. (missing querySelector renderer option)`
      );
      return null;
    } else {
      const target = select(targetSelector);
      if (!target) {
         true && warn(
          `Failed to locate Teleport target with selector "${targetSelector}". Note the target element must exist before the component is mounted - i.e. the target cannot be rendered by the component itself, and ideally should be outside of the entire Vue component tree.`
        );
      }
      return target;
    }
  } else {
    if ( true && !targetSelector && !isTeleportDisabled(props)) {
      warn(`Invalid Teleport target: ${targetSelector}`);
    }
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if ( true && isHmrUpdating) {
      optimized = false;
      dynamicChildren = null;
    }
    if (n1 == null) {
      const placeholder = n2.el =  true ? createComment("teleport start") : 0;
      const mainAnchor = n2.anchor =  true ? createComment("teleport end") : 0;
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      } else if ( true && !disabled) {
        warn("Invalid Teleport target on mount:", target, `(${typeof target})`);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          false
        );
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          } else if (true) {
            warn(
              "Invalid Teleport target on update:",
              target,
              `(${typeof target})`
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            true,
            !!child.dynamicChildren
          );
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(
          targetNode,
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}

const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  if ( true && n2.shapeFlag & 6 && hmrDirtyComponents.has(n2.type)) {
    n1.shapeFlag &= ~256;
    n2.shapeFlag &= ~512;
    return false;
  }
  return n1.type === n2.type && n1.key === n2.key;
}
let vnodeArgsTransformer;
function transformVNodeArgs(transformer) {
  vnodeArgsTransformer = transformer;
}
const createVNodeWithArgsTransform = (...args) => {
  return _createVNode(
    ...vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args
  );
};
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref,
  ref_key,
  ref_for
}) => {
  if (typeof ref === "number") {
    ref = "" + ref;
  }
  return ref != null ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(ref) || (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(ref) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(children) ? 8 : 16;
  }
  if ( true && vnode.key !== vnode.key) {
    warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode =  true ? createVNodeWithArgsTransform : 0;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if ( true && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`);
    }
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(klass)) {
      props.class = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeClass)(klass);
    }
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(style)) {
      if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isProxy)(style) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(style)) {
        style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, style);
      }
      props.style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeStyle)(style);
    }
  }
  const shapeFlag = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(type) ? 4 : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(type) ? 2 : 0;
  if ( true && shapeFlag & 4 && (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isProxy)(type)) {
    type = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(type);
    warn(
      `Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`,
      `
Component that was made reactive: `,
      type
    );
  }
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isProxy)(props) || InternalObjectKey in props ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children:  true && patchFlag === -1 && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(children) ? children.map(deepCloneVNode) : children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function deepCloneVNode(vnode) {
  const cloned = cloneVNode(vnode);
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(vnode.children)) {
    cloned.children = vnode.children.map(deepCloneVNode);
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeClass)([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.normalizeStyle)([ret.style, toMerge.style]);
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}

const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    data: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    props: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    attrs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    slots: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    refs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    setupState: _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  if (true) {
    instance.ctx = createDevRenderContext(instance);
  } else {}
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)()[settersKey])) {
    globalCurrentInstanceSetters = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.getGlobalThis)()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.makeMap)("slot,component");
function validateComponentName(name, config) {
  const appIsNativeTag = config.isNativeTag || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NO;
  if (isBuiltInTag(name) || appIsNativeTag(name)) {
    warn(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  var _a;
  const Component = instance.type;
  if (true) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config);
    }
    if (Component.components) {
      const names = Object.keys(Component.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component.directives) {
      const names = Object.keys(Component.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component.compilerOptions && isRuntimeOnly()) {
      warn(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.markRaw)(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  if (true) {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [ true ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly)(instance.props) : 0, setupContext]
    );
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
    unsetCurrentInstance();
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isPromise)(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
        if ( true && !instance.suspense) {
          const name = (_a = Component.name) != null ? _a : "Anonymous";
          warn(
            `Component <${name}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
          );
        }
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(setupResult)) {
    if ( true && isVNode(setupResult)) {
      warn(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    if (true) {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.proxyRefs)(setupResult);
    if (true) {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if ( true && setupResult !== void 0) {
    warn(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
let installWithProxy;
function registerRuntimeCompiler(_compile) {
  compile = _compile;
  installWithProxy = (i) => {
    if (i.render._rc) {
      i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
    }
  };
}
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        if (true) {
          startMeasure(instance, `compile`);
        }
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
        if (true) {
          endMeasure(instance, `compile`);
        }
      }
    }
    instance.render = Component.render || _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP;
    if (installWithProxy) {
      installWithProxy(instance);
    }
  }
  if (true) {
    setCurrentInstance(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.pauseTracking)();
    applyOptions(instance);
    (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.resetTracking)();
    unsetCurrentInstance();
  }
  if ( true && !Component.render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_1__.NOOP && !isSSR) {
    if (!compile && Component.template) {
      warn(
        `Component provided template option but runtime compilation is not supported in this build of Vue.` + (` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".` )
        /* should not happen */
      );
    } else {
      warn(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
     true ? {
      get(target, key) {
        markAttrsAccessed();
        (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.track)(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn(`setupContext.attrs is readonly.`);
        return false;
      }
    } : 0
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.track)(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    if (true) {
      if (instance.exposed) {
        warn(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(exposed)) {
            exposedType = "array";
          } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  if (true) {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  } else {}
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.proxyRefs)((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.markRaw)(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value) && "__vccOpts" in value;
}

const computed = (getterOrOptions, debugOptions) => {
  return (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.computed)(getterOrOptions, debugOptions, isInSSRComponentSetup);
};

function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(propsOrChildren) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}

const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    if (!ctx) {
       true && warn(
        `Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`
      );
    }
    return ctx;
  }
};

function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}

function initCustomFormatter() {
  if ( false || typeof window === "undefined") {
    return;
  }
  const vueStyle = { style: "color:#3ba776" };
  const numberStyle = { style: "color:#0b1bc9" };
  const stringStyle = { style: "color:#b62e24" };
  const keywordStyle = { style: "color:#9d288c" };
  const formatter = {
    header(obj) {
      if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(obj)) {
        return null;
      }
      if (obj.__isVue) {
        return ["div", vueStyle, `VueInstance`];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isRef)(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, genRefFlag(obj)],
          "<",
          formatValue(obj.value),
          `>`
        ];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReactive)(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
          "<",
          formatValue(obj),
          `>${(0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReadonly)(obj) ? ` (readonly)` : ``}`
        ];
      } else if ((0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.isReadonly)(obj)) {
        return [
          "div",
          {},
          ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
          "<",
          formatValue(obj),
          ">"
        ];
      }
      return null;
    },
    hasBody(obj) {
      return obj && obj.__isVue;
    },
    body(obj) {
      if (obj && obj.__isVue) {
        return [
          "div",
          {},
          ...formatInstance(obj.$)
        ];
      }
    }
  };
  function formatInstance(instance) {
    const blocks = [];
    if (instance.type.props && instance.props) {
      blocks.push(createInstanceBlock("props", (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(instance.props)));
    }
    if (instance.setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ) {
      blocks.push(createInstanceBlock("setup", instance.setupState));
    }
    if (instance.data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ) {
      blocks.push(createInstanceBlock("data", (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(instance.data)));
    }
    const computed = extractKeys(instance, "computed");
    if (computed) {
      blocks.push(createInstanceBlock("computed", computed));
    }
    const injected = extractKeys(instance, "inject");
    if (injected) {
      blocks.push(createInstanceBlock("injected", injected));
    }
    blocks.push([
      "div",
      {},
      [
        "span",
        {
          style: keywordStyle.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: instance }]
    ]);
    return blocks;
  }
  function createInstanceBlock(type, target) {
    target = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, target);
    if (!Object.keys(target).length) {
      return ["span", {}];
    }
    return [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        type
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(target).map((key) => {
          return [
            "div",
            {},
            ["span", keywordStyle, key + ": "],
            formatValue(target[key], false)
          ];
        })
      ]
    ];
  }
  function formatValue(v, asRaw = true) {
    if (typeof v === "number") {
      return ["span", numberStyle, v];
    } else if (typeof v === "string") {
      return ["span", stringStyle, JSON.stringify(v)];
    } else if (typeof v === "boolean") {
      return ["span", keywordStyle, v];
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(v)) {
      return ["object", { object: asRaw ? (0,_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__.toRaw)(v) : v }];
    } else {
      return ["span", stringStyle, String(v)];
    }
  }
  function extractKeys(instance, type) {
    const Comp = instance.type;
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(Comp)) {
      return;
    }
    const extracted = {};
    for (const key in instance.ctx) {
      if (isKeyOfType(Comp, key, type)) {
        extracted[key] = instance.ctx[key];
      }
    }
    return extracted;
  }
  function isKeyOfType(Comp, key, type) {
    const opts = Comp[type];
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(opts) && opts.includes(key) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(opts) && key in opts) {
      return true;
    }
    if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
      return true;
    }
    if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) {
      return true;
    }
  }
  function genRefFlag(v) {
    if (isShallow(v)) {
      return `ShallowRef`;
    }
    if (v.effect) {
      return `ComputedRef`;
    }
    return `Ref`;
  }
  if (window.devtoolsFormatters) {
    window.devtoolsFormatters.push(formatter);
  } else {
    window.devtoolsFormatters = [formatter];
  }
}

function withMemo(memo, render, cache, index) {
  const cached = cache[index];
  if (cached && isMemoSame(cached, memo)) {
    return cached;
  }
  const ret = render();
  ret.memo = memo.slice();
  return cache[index] = ret;
}
function isMemoSame(cached, memo) {
  const prev = cached.memo;
  if (prev.length != memo.length) {
    return false;
  }
  for (let i = 0; i < prev.length; i++) {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hasChanged)(prev[i], memo[i])) {
      return false;
    }
  }
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(cached);
  }
  return true;
}

const version = "3.3.4";
const _ssrUtils = {
  createComponentInstance,
  setupComponent,
  renderComponentRoot,
  setCurrentRenderingInstance,
  isVNode: isVNode,
  normalizeVNode
};
const ssrUtils = _ssrUtils ;
const resolveFilter = null;
const compatUtils = null;




/***/ }),

/***/ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTransition: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransition),
/* harmony export */   BaseTransitionPropsValidators: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransitionPropsValidators),
/* harmony export */   Comment: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Comment),
/* harmony export */   EffectScope: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.EffectScope),
/* harmony export */   Fragment: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   KeepAlive: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.KeepAlive),
/* harmony export */   ReactiveEffect: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect),
/* harmony export */   Static: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Static),
/* harmony export */   Suspense: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Suspense),
/* harmony export */   Teleport: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Teleport),
/* harmony export */   Text: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Text),
/* harmony export */   Transition: () => (/* binding */ Transition),
/* harmony export */   TransitionGroup: () => (/* binding */ TransitionGroup),
/* harmony export */   VueElement: () => (/* binding */ VueElement),
/* harmony export */   assertNumber: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.assertNumber),
/* harmony export */   callWithAsyncErrorHandling: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling),
/* harmony export */   camelize: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.camelize),
/* harmony export */   capitalize: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.capitalize),
/* harmony export */   cloneVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.cloneVNode),
/* harmony export */   compatUtils: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.compatUtils),
/* harmony export */   computed: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.computed),
/* harmony export */   createApp: () => (/* binding */ createApp),
/* harmony export */   createBlock: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createBlock),
/* harmony export */   createCommentVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode),
/* harmony export */   createElementBlock: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createElementBlock),
/* harmony export */   createElementVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createElementVNode),
/* harmony export */   createHydrationRenderer: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer),
/* harmony export */   createPropsRestProxy: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createPropsRestProxy),
/* harmony export */   createRenderer: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createRenderer),
/* harmony export */   createSSRApp: () => (/* binding */ createSSRApp),
/* harmony export */   createSlots: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createSlots),
/* harmony export */   createStaticVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode),
/* harmony export */   createTextVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createTextVNode),
/* harmony export */   createVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode),
/* harmony export */   customRef: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.customRef),
/* harmony export */   defineAsyncComponent: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineAsyncComponent),
/* harmony export */   defineComponent: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineComponent),
/* harmony export */   defineCustomElement: () => (/* binding */ defineCustomElement),
/* harmony export */   defineEmits: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineEmits),
/* harmony export */   defineExpose: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineExpose),
/* harmony export */   defineModel: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineModel),
/* harmony export */   defineOptions: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineOptions),
/* harmony export */   defineProps: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineProps),
/* harmony export */   defineSSRCustomElement: () => (/* binding */ defineSSRCustomElement),
/* harmony export */   defineSlots: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineSlots),
/* harmony export */   devtools: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.devtools),
/* harmony export */   effect: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.effect),
/* harmony export */   effectScope: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.effectScope),
/* harmony export */   getCurrentInstance: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance),
/* harmony export */   getCurrentScope: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope),
/* harmony export */   getTransitionRawChildren: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren),
/* harmony export */   guardReactiveProps: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps),
/* harmony export */   h: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.h),
/* harmony export */   handleError: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.handleError),
/* harmony export */   hasInjectionContext: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.hasInjectionContext),
/* harmony export */   hydrate: () => (/* binding */ hydrate),
/* harmony export */   initCustomFormatter: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.initCustomFormatter),
/* harmony export */   initDirectivesForSSR: () => (/* binding */ initDirectivesForSSR),
/* harmony export */   inject: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.inject),
/* harmony export */   isMemoSame: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isMemoSame),
/* harmony export */   isProxy: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isProxy),
/* harmony export */   isReactive: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRef),
/* harmony export */   isRuntimeOnly: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly),
/* harmony export */   isShallow: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isShallow),
/* harmony export */   isVNode: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isVNode),
/* harmony export */   markRaw: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.markRaw),
/* harmony export */   mergeDefaults: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.mergeDefaults),
/* harmony export */   mergeModels: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.mergeModels),
/* harmony export */   mergeProps: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.mergeProps),
/* harmony export */   nextTick: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.nextTick),
/* harmony export */   normalizeClass: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeClass),
/* harmony export */   normalizeProps: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeProps),
/* harmony export */   normalizeStyle: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle),
/* harmony export */   onActivated: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onActivated),
/* harmony export */   onBeforeMount: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onBeforeUpdate),
/* harmony export */   onDeactivated: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onDeactivated),
/* harmony export */   onErrorCaptured: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onErrorCaptured),
/* harmony export */   onMounted: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onMounted),
/* harmony export */   onRenderTracked: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onRenderTracked),
/* harmony export */   onRenderTriggered: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onRenderTriggered),
/* harmony export */   onScopeDispose: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onScopeDispose),
/* harmony export */   onServerPrefetch: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onServerPrefetch),
/* harmony export */   onUnmounted: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUnmounted),
/* harmony export */   onUpdated: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUpdated),
/* harmony export */   openBlock: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.openBlock),
/* harmony export */   popScopeId: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.popScopeId),
/* harmony export */   provide: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.provide),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.proxyRefs),
/* harmony export */   pushScopeId: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.pushScopeId),
/* harmony export */   queuePostFlushCb: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.queuePostFlushCb),
/* harmony export */   reactive: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ref),
/* harmony export */   registerRuntimeCompiler: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.registerRuntimeCompiler),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   renderList: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.renderList),
/* harmony export */   renderSlot: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.renderSlot),
/* harmony export */   resolveComponent: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveComponent),
/* harmony export */   resolveDirective: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveDirective),
/* harmony export */   resolveDynamicComponent: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent),
/* harmony export */   resolveFilter: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveFilter),
/* harmony export */   resolveTransitionHooks: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks),
/* harmony export */   setBlockTracking: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setBlockTracking),
/* harmony export */   setDevtoolsHook: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setDevtoolsHook),
/* harmony export */   setTransitionHooks: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.shallowRef),
/* harmony export */   ssrContextKey: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ssrContextKey),
/* harmony export */   ssrUtils: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.ssrUtils),
/* harmony export */   stop: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.stop),
/* harmony export */   toDisplayString: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toDisplayString),
/* harmony export */   toHandlerKey: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toHandlerKey),
/* harmony export */   toHandlers: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toHandlers),
/* harmony export */   toRaw: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toRefs),
/* harmony export */   toValue: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.toValue),
/* harmony export */   transformVNodeArgs: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.transformVNodeArgs),
/* harmony export */   triggerRef: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.triggerRef),
/* harmony export */   unref: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.unref),
/* harmony export */   useAttrs: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useAttrs),
/* harmony export */   useCssModule: () => (/* binding */ useCssModule),
/* harmony export */   useCssVars: () => (/* binding */ useCssVars),
/* harmony export */   useModel: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useModel),
/* harmony export */   useSSRContext: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useSSRContext),
/* harmony export */   useSlots: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useSlots),
/* harmony export */   useTransitionState: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useTransitionState),
/* harmony export */   vModelCheckbox: () => (/* binding */ vModelCheckbox),
/* harmony export */   vModelDynamic: () => (/* binding */ vModelDynamic),
/* harmony export */   vModelRadio: () => (/* binding */ vModelRadio),
/* harmony export */   vModelSelect: () => (/* binding */ vModelSelect),
/* harmony export */   vModelText: () => (/* binding */ vModelText),
/* harmony export */   vShow: () => (/* binding */ vShow),
/* harmony export */   version: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.version),
/* harmony export */   warn: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn),
/* harmony export */   watch: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watch),
/* harmony export */   watchEffect: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchEffect),
/* harmony export */   watchPostEffect: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect),
/* harmony export */   watchSyncEffect: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchSyncEffect),
/* harmony export */   withAsyncContext: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withAsyncContext),
/* harmony export */   withCtx: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withCtx),
/* harmony export */   withDefaults: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withDefaults),
/* harmony export */   withDirectives: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withDirectives),
/* harmony export */   withKeys: () => (/* binding */ withKeys),
/* harmony export */   withMemo: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withMemo),
/* harmony export */   withModifiers: () => (/* binding */ withModifiers),
/* harmony export */   withScopeId: () => (/* reexport safe */ _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.withScopeId)
/* harmony export */ });
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");




const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};

function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}

function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(next);
  if (next && !isCssString) {
    if (prev && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const semicolonRE = /[^\\];\s*$/;
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (true) {
      if (semicolonRE.test(val)) {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
          `Unexpected semicolon at the end of '${name}' style value: '${val}'`
        );
      }
    }
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.capitalize)(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}

const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSpecialBooleanAttr)(key);
    if (value == null || isBoolean && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.includeBooleanAttr)(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}

function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.includeBooleanAttr)(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
    if ( true && !needRemove) {
      (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
        `Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`,
        e
      );
    }
  }
  needRemove && el.removeAttribute(key);
}

function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling)(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}

const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isOn)(key)) {
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isModelListener)(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(value)) {
    return false;
  }
  return key in el;
}

function defineCustomElement(options, hydrate2) {
  const Comp = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.defineComponent)(options);
  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydrate2);
    }
  }
  VueCustomElement.def = Comp;
  return VueCustomElement;
}
const defineSSRCustomElement = (options) => {
  return defineCustomElement(options, hydrate);
};
const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
};
class VueElement extends BaseClass {
  constructor(_def, _props = {}, hydrate2) {
    super();
    this._def = _def;
    this._props = _props;
    /**
     * @internal
     */
    this._instance = null;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;
    if (this.shadowRoot && hydrate2) {
      hydrate2(this._createVNode(), this.shadowRoot);
    } else {
      if ( true && this.shadowRoot) {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
          `Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use \`defineSSRCustomElement\`.`
        );
      }
      this.attachShadow({ mode: "open" });
      if (!this._def.__asyncLoader) {
        this._resolveProps(this._def);
      }
    }
  }
  connectedCallback() {
    this._connected = true;
    if (!this._instance) {
      if (this._resolved) {
        this._update();
      } else {
        this._resolveDef();
      }
    }
  }
  disconnectedCallback() {
    this._connected = false;
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.nextTick)(() => {
      if (!this._connected) {
        render(null, this.shadowRoot);
        this._instance = null;
      }
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    this._resolved = true;
    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    }
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }).observe(this, { attributes: true });
    const resolve = (def, isAsync = false) => {
      const { props, styles } = def;
      let numberProps;
      if (props && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(props)) {
        for (const key in props) {
          const opt = props[key];
          if (opt === Number || opt && opt.type === Number) {
            if (key in this._props) {
              this._props[key] = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(this._props[key]);
            }
            (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key)] = true;
          }
        }
      }
      this._numberProps = numberProps;
      if (isAsync) {
        this._resolveProps(def);
      }
      this._applyStyles(styles);
      this._update();
    };
    const asyncDef = this._def.__asyncLoader;
    if (asyncDef) {
      asyncDef().then((def) => resolve(def, true));
    } else {
      resolve(this._def);
    }
  }
  _resolveProps(def) {
    const { props } = def;
    const declaredPropKeys = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(props) ? props : Object.keys(props || {});
    for (const key of Object.keys(this)) {
      if (key[0] !== "_" && declaredPropKeys.includes(key)) {
        this._setProp(key, this[key], true, false);
      }
    }
    for (const key of declaredPropKeys.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)) {
      Object.defineProperty(this, key, {
        get() {
          return this._getProp(key);
        },
        set(val) {
          this._setProp(key, val);
        }
      });
    }
  }
  _setAttr(key) {
    let value = this.getAttribute(key);
    const camelKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.camelize)(key);
    if (this._numberProps && this._numberProps[camelKey]) {
      value = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(value);
    }
    this._setProp(camelKey, value, false);
  }
  /**
   * @internal
   */
  _getProp(key) {
    return this._props[key];
  }
  /**
   * @internal
   */
  _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
    if (val !== this._props[key]) {
      this._props[key] = val;
      if (shouldUpdate && this._instance) {
        this._update();
      }
      if (shouldReflect) {
        if (val === true) {
          this.setAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key), "");
        } else if (typeof val === "string" || typeof val === "number") {
          this.setAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key), val + "");
        } else if (!val) {
          this.removeAttribute((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(key));
        }
      }
    }
  }
  _update() {
    render(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const vnode = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode)(this._def, (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, this._props));
    if (!this._instance) {
      vnode.ce = (instance) => {
        this._instance = instance;
        instance.isCE = true;
        if (true) {
          instance.ceReload = (newStyles) => {
            if (this._styles) {
              this._styles.forEach((s) => this.shadowRoot.removeChild(s));
              this._styles.length = 0;
            }
            this._applyStyles(newStyles);
            this._instance = null;
            this._update();
          };
        }
        const dispatch = (event, args) => {
          this.dispatchEvent(
            new CustomEvent(event, {
              detail: args
            })
          );
        };
        instance.emit = (event, ...args) => {
          dispatch(event, args);
          if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event) !== event) {
            dispatch((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event), args);
          }
        };
        let parent = this;
        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            instance.parent = parent._instance;
            instance.provides = parent._instance.provides;
            break;
          }
        }
      };
    }
    return vnode;
  }
  _applyStyles(styles) {
    if (styles) {
      styles.forEach((css) => {
        const s = document.createElement("style");
        s.textContent = css;
        this.shadowRoot.appendChild(s);
        if (true) {
          (this._styles || (this._styles = [])).push(s);
        }
      });
    }
  }
}

function useCssModule(name = "$style") {
  {
    const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    if (!instance) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`useCssModule must be called inside setup()`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }
    const modules = instance.type.__cssModules;
    if (!modules) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Current instance does not have CSS modules injected.`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }
    const mod = modules[name];
    if (!mod) {
       true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`Current instance does not have CSS module named "${name}".`);
      return _vue_shared__WEBPACK_IMPORTED_MODULE_1__.EMPTY_OBJ;
    }
    return mod;
  }
}

function useCssVars(getter) {
  const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
  if (!instance) {
     true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`useCssVars is called without current active component instance.`);
    return;
  }
  const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
    ).forEach((node) => setVarsOnNode(node, vars));
  };
  const setVars = () => {
    const vars = getter(instance.proxy);
    setVarsOnVNode(instance.subTree, vars);
    updateTeleports(vars);
  };
  (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect)(setVars);
  (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onMounted)(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Static) {
    let { el, anchor } = vnode;
    while (el) {
      setVarsOnNode(el, vars);
      if (el === anchor)
        break;
      el = el.nextSibling;
    }
  }
}
function setVarsOnNode(el, vars) {
  if (el.nodeType === 1) {
    const style = el.style;
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}

const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.h)(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(
  {},
  _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve);
        }
      });
    };
  };
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve);
        }
      });
      callHook(onLeave, [el, resolve]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isObject)(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.toNumber)(val);
  if (true) {
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.assertNumber)(res, "<transition> explicit duration");
  }
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}

const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance)();
    const state = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.useTransitionState)();
    let prevChildren;
    let children;
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.onUpdated)(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(
        prevChildren[0].el,
        instance.vnode.el,
        moveClass
      )) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el = c.el;
        const style = el.style;
        addTransitionClass(el, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el._moveCb = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        };
        el.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_2__.toRaw)(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.Fragment;
      prevChildren = children;
      children = slots.default ? (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren)(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks)(
            child,
            (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks)(child, cssTransitionProps, state, instance)
          );
        } else if (true) {
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(`<TransitionGroup> children must be keyed.`);
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks)(
            child,
            (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks)(child, cssTransitionProps, state, instance)
          );
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createVNode)(tag, null, children);
    };
  }
};
const removeMode = (props) => delete props.mode;
/* @__PURE__ */ removeMode(TransitionGroupImpl.props);
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el._moveCb) {
    el._moveCb();
  }
  if (el._enterCb) {
    el._enterCb();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el, root, moveClass) {
  const clone = el.cloneNode();
  if (el._vtc) {
    el._vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}

const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(fn) ? (value) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.invokeArrayFns)(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseToNumber)(domValue);
      }
      el._assign(domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseToNumber)(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign = el._assign;
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(modelValue)) {
        const index = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign(filtered);
        }
      } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign(cloned);
      } else {
        assign(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, vnode.props.value) > -1;
  } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, getCheckboxValue(el, true));
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, vnode.props.value);
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el._assign(getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
        (o) => number ? (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseToNumber)(getValue(o)) : getValue(o)
      );
      el._assign(
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
    });
    el._assign = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el._assign = getModelAssigner(vnode);
  },
  updated(el, { value }) {
    setSelected(el, value);
  }
};
function setSelected(el, value) {
  const isMultiple = el.multiple;
  if (isMultiple && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value) && !(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
     true && (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
      `<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(value).slice(8, -1)}.`
    );
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
        option.selected = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, optionValue) > -1;
      } else {
        option.selected = value.has(optionValue);
      }
    } else {
      if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(getValue(option), value)) {
        if (el.selectedIndex !== i)
          el.selectedIndex = i;
        return;
      }
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const vModelDynamic = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "created");
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "mounted");
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "updated");
  }
};
function resolveDynamicModel(tagName, type) {
  switch (tagName) {
    case "SELECT":
      return vModelSelect;
    case "TEXTAREA":
      return vModelText;
    default:
      switch (type) {
        case "checkbox":
          return vModelCheckbox;
        case "radio":
          return vModelRadio;
        default:
          return vModelText;
      }
  }
}
function callModelHook(el, binding, vnode, prevVNode, hook) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type
  );
  const fn = modelToUse[hook];
  fn && fn(el, binding, vnode, prevVNode);
}
function initVModelForSSR() {
  vModelText.getSSRProps = ({ value }) => ({ value });
  vModelRadio.getSSRProps = ({ value }, vnode) => {
    if (vnode.props && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseEqual)(vnode.props.value, value)) {
      return { checked: true };
    }
  };
  vModelCheckbox.getSSRProps = ({ value }, vnode) => {
    if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(value)) {
      if (vnode.props && (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.looseIndexOf)(value, vnode.props.value) > -1) {
        return { checked: true };
      }
    } else if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSet)(value)) {
      if (vnode.props && value.has(vnode.props.value)) {
        return { checked: true };
      }
    } else if (value) {
      return { checked: true };
    }
  };
  vModelDynamic.getSSRProps = (binding, vnode) => {
    if (typeof vnode.type !== "string") {
      return;
    }
    const modelToUse = resolveDynamicModel(
      // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
      vnode.type.toUpperCase(),
      vnode.props && vnode.props.type
    );
    if (modelToUse.getSSRProps) {
      return modelToUse.getSSRProps(binding, vnode);
    }
  };
}

const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn, modifiers) => {
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.hyphenate)(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn(event);
    }
  };
};

const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
function initVShowForSSR() {
  vShow.getSSRProps = ({ value }) => {
    if (!value) {
      return { style: { display: "none" } };
    }
  };
}

const rendererOptions = /* @__PURE__ */ (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.extend)({ patchProp }, nodeOps);
let renderer;
let enabledHydration = false;
function ensureRenderer() {
  return renderer || (renderer = (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createRenderer)(rendererOptions));
}
function ensureHydrationRenderer() {
  renderer = enabledHydration ? renderer : (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer)(rendererOptions);
  enabledHydration = true;
  return renderer;
}
const render = (...args) => {
  ensureRenderer().render(...args);
};
const hydrate = (...args) => {
  ensureHydrationRenderer().hydrate(...args);
};
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  if (true) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!(0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
const createSSRApp = (...args) => {
  const app = ensureHydrationRenderer().createApp(...args);
  if (true) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (container) {
      return mount(container, true, container instanceof SVGElement);
    }
  };
  return app;
};
function injectNativeTagCheck(app) {
  Object.defineProperty(app.config, "isNativeTag", {
    value: (tag) => (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isHTMLTag)(tag) || (0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isSVGTag)(tag),
    writable: false
  });
}
function injectCompilerOptionsCheck(app) {
  if ((0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly)()) {
    const isCustomElement = app.config.isCustomElement;
    Object.defineProperty(app.config, "isCustomElement", {
      get() {
        return isCustomElement;
      },
      set() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
          `The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`
        );
      }
    });
    const compilerOptions = app.config.compilerOptions;
    const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
    Object.defineProperty(app.config, "compilerOptions", {
      get() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(msg);
        return compilerOptions;
      },
      set() {
        (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(msg);
      }
    });
  }
}
function normalizeContainer(container) {
  if ((0,_vue_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(container)) {
    const res = document.querySelector(container);
    if ( true && !res) {
      (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
        `Failed to mount app: mount target selector "${container}" returned null.`
      );
    }
    return res;
  }
  if ( true && window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
    (0,_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__.warn)(
      `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
    );
  }
  return container;
}
let ssrDirectiveInitialized = false;
const initDirectivesForSSR = () => {
  if (!ssrDirectiveInitialized) {
    ssrDirectiveInitialized = true;
    initVModelForSSR();
    initVShowForSSR();
  }
} ;




/***/ }),

/***/ "./node_modules/@vue/shared/dist/shared.esm-bundler.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vue/shared/dist/shared.esm-bundler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_ARR: () => (/* binding */ EMPTY_ARR),
/* harmony export */   EMPTY_OBJ: () => (/* binding */ EMPTY_OBJ),
/* harmony export */   NO: () => (/* binding */ NO),
/* harmony export */   NOOP: () => (/* binding */ NOOP),
/* harmony export */   PatchFlagNames: () => (/* binding */ PatchFlagNames),
/* harmony export */   camelize: () => (/* binding */ camelize),
/* harmony export */   capitalize: () => (/* binding */ capitalize),
/* harmony export */   def: () => (/* binding */ def),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   escapeHtmlComment: () => (/* binding */ escapeHtmlComment),
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   genPropsAccessExp: () => (/* binding */ genPropsAccessExp),
/* harmony export */   generateCodeFrame: () => (/* binding */ generateCodeFrame),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   hasChanged: () => (/* binding */ hasChanged),
/* harmony export */   hasOwn: () => (/* binding */ hasOwn),
/* harmony export */   hyphenate: () => (/* binding */ hyphenate),
/* harmony export */   includeBooleanAttr: () => (/* binding */ includeBooleanAttr),
/* harmony export */   invokeArrayFns: () => (/* binding */ invokeArrayFns),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBooleanAttr: () => (/* binding */ isBooleanAttr),
/* harmony export */   isBuiltInDirective: () => (/* binding */ isBuiltInDirective),
/* harmony export */   isDate: () => (/* binding */ isDate),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isGloballyWhitelisted: () => (/* binding */ isGloballyWhitelisted),
/* harmony export */   isHTMLTag: () => (/* binding */ isHTMLTag),
/* harmony export */   isIntegerKey: () => (/* binding */ isIntegerKey),
/* harmony export */   isKnownHtmlAttr: () => (/* binding */ isKnownHtmlAttr),
/* harmony export */   isKnownSvgAttr: () => (/* binding */ isKnownSvgAttr),
/* harmony export */   isMap: () => (/* binding */ isMap),
/* harmony export */   isModelListener: () => (/* binding */ isModelListener),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isOn: () => (/* binding */ isOn),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   isRegExp: () => (/* binding */ isRegExp),
/* harmony export */   isReservedProp: () => (/* binding */ isReservedProp),
/* harmony export */   isSSRSafeAttrName: () => (/* binding */ isSSRSafeAttrName),
/* harmony export */   isSVGTag: () => (/* binding */ isSVGTag),
/* harmony export */   isSet: () => (/* binding */ isSet),
/* harmony export */   isSpecialBooleanAttr: () => (/* binding */ isSpecialBooleanAttr),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isSymbol: () => (/* binding */ isSymbol),
/* harmony export */   isVoidTag: () => (/* binding */ isVoidTag),
/* harmony export */   looseEqual: () => (/* binding */ looseEqual),
/* harmony export */   looseIndexOf: () => (/* binding */ looseIndexOf),
/* harmony export */   looseToNumber: () => (/* binding */ looseToNumber),
/* harmony export */   makeMap: () => (/* binding */ makeMap),
/* harmony export */   normalizeClass: () => (/* binding */ normalizeClass),
/* harmony export */   normalizeProps: () => (/* binding */ normalizeProps),
/* harmony export */   normalizeStyle: () => (/* binding */ normalizeStyle),
/* harmony export */   objectToString: () => (/* binding */ objectToString),
/* harmony export */   parseStringStyle: () => (/* binding */ parseStringStyle),
/* harmony export */   propsToAttrMap: () => (/* binding */ propsToAttrMap),
/* harmony export */   remove: () => (/* binding */ remove),
/* harmony export */   slotFlagsText: () => (/* binding */ slotFlagsText),
/* harmony export */   stringifyStyle: () => (/* binding */ stringifyStyle),
/* harmony export */   toDisplayString: () => (/* binding */ toDisplayString),
/* harmony export */   toHandlerKey: () => (/* binding */ toHandlerKey),
/* harmony export */   toNumber: () => (/* binding */ toNumber),
/* harmony export */   toRawType: () => (/* binding */ toRawType),
/* harmony export */   toTypeString: () => (/* binding */ toTypeString)
/* harmony export */ });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}

const EMPTY_OBJ =  true ? Object.freeze({}) : 0;
const EMPTY_ARR =  true ? Object.freeze([]) : 0;
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
);
const toHandlerKey = cacheStringFunction(
  (str) => str ? `on${capitalize(str)}` : ``
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : {});
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}

const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};

const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};

const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);

const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(
          `${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`
        );
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          );
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}

function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number") {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}

const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);

const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(
  specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(
  `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`
);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(
  `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
);

const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index;
  let lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escaped;
  }
  return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}

function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}

const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};




/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");

var _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("h1", null, "All Players", -1 /* HOISTED */);
var _hoisted_2 = [_hoisted_1];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, _hoisted_2);
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/exportHelper.js":
/*!******************************************************!*\
  !*** ./node_modules/vue-loader/dist/exportHelper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// runtime helper for setting properties on components
// in a tree-shakable way
exports["default"] = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ "./src/vue/pages/admin/team-players/all/Table.vue":
/*!********************************************************!*\
  !*** ./src/vue/pages/admin/team-players/all/Table.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Table_vue_vue_type_template_id_34c10620__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Table.vue?vue&type=template&id=34c10620 */ "./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620");
/* harmony import */ var _Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Table.vue?vue&type=script&lang=js */ "./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Table_vue_vue_type_template_id_34c10620__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"src/vue/pages/admin/team-players/all/Table.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_2_use_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_10_use_0_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_2_use_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_10_use_0_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./Table.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620":
/*!**************************************************************************************!*\
  !*** ./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620 ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_2_use_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_10_use_0_Table_vue_vue_type_template_id_34c10620__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_2_use_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_10_use_0_Table_vue_vue_type_template_id_34c10620__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!../../../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./Table.vue?vue&type=template&id=34c10620 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-2.use!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[10].use[0]!./src/vue/pages/admin/team-players/all/Table.vue?vue&type=template&id=34c10620");


/***/ }),

/***/ "./node_modules/vue/dist/vue.runtime.esm-bundler.js":
/*!**********************************************************!*\
  !*** ./node_modules/vue/dist/vue.runtime.esm-bundler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseTransition: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.BaseTransition),
/* harmony export */   BaseTransitionPropsValidators: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.BaseTransitionPropsValidators),
/* harmony export */   Comment: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Comment),
/* harmony export */   EffectScope: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.EffectScope),
/* harmony export */   Fragment: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   KeepAlive: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.KeepAlive),
/* harmony export */   ReactiveEffect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ReactiveEffect),
/* harmony export */   Static: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Static),
/* harmony export */   Suspense: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Suspense),
/* harmony export */   Teleport: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Teleport),
/* harmony export */   Text: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Text),
/* harmony export */   Transition: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.Transition),
/* harmony export */   TransitionGroup: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.TransitionGroup),
/* harmony export */   VueElement: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.VueElement),
/* harmony export */   assertNumber: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.assertNumber),
/* harmony export */   callWithAsyncErrorHandling: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling),
/* harmony export */   camelize: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.camelize),
/* harmony export */   capitalize: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.capitalize),
/* harmony export */   cloneVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.cloneVNode),
/* harmony export */   compatUtils: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.compatUtils),
/* harmony export */   compile: () => (/* binding */ compile),
/* harmony export */   computed: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.computed),
/* harmony export */   createApp: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createApp),
/* harmony export */   createBlock: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createBlock),
/* harmony export */   createCommentVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode),
/* harmony export */   createElementBlock: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createElementBlock),
/* harmony export */   createElementVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createElementVNode),
/* harmony export */   createHydrationRenderer: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createHydrationRenderer),
/* harmony export */   createPropsRestProxy: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createPropsRestProxy),
/* harmony export */   createRenderer: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createRenderer),
/* harmony export */   createSSRApp: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createSSRApp),
/* harmony export */   createSlots: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createSlots),
/* harmony export */   createStaticVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode),
/* harmony export */   createTextVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createTextVNode),
/* harmony export */   createVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.createVNode),
/* harmony export */   customRef: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.customRef),
/* harmony export */   defineAsyncComponent: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineAsyncComponent),
/* harmony export */   defineComponent: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineComponent),
/* harmony export */   defineCustomElement: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineCustomElement),
/* harmony export */   defineEmits: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineEmits),
/* harmony export */   defineExpose: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineExpose),
/* harmony export */   defineModel: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineModel),
/* harmony export */   defineOptions: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineOptions),
/* harmony export */   defineProps: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineProps),
/* harmony export */   defineSSRCustomElement: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineSSRCustomElement),
/* harmony export */   defineSlots: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.defineSlots),
/* harmony export */   devtools: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.devtools),
/* harmony export */   effect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.effect),
/* harmony export */   effectScope: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.effectScope),
/* harmony export */   getCurrentInstance: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getCurrentInstance),
/* harmony export */   getCurrentScope: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getCurrentScope),
/* harmony export */   getTransitionRawChildren: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.getTransitionRawChildren),
/* harmony export */   guardReactiveProps: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps),
/* harmony export */   h: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.h),
/* harmony export */   handleError: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.handleError),
/* harmony export */   hasInjectionContext: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.hasInjectionContext),
/* harmony export */   hydrate: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.hydrate),
/* harmony export */   initCustomFormatter: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.initCustomFormatter),
/* harmony export */   initDirectivesForSSR: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.initDirectivesForSSR),
/* harmony export */   inject: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.inject),
/* harmony export */   isMemoSame: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isMemoSame),
/* harmony export */   isProxy: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isProxy),
/* harmony export */   isReactive: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isRef),
/* harmony export */   isRuntimeOnly: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isRuntimeOnly),
/* harmony export */   isShallow: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isShallow),
/* harmony export */   isVNode: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.isVNode),
/* harmony export */   markRaw: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.markRaw),
/* harmony export */   mergeDefaults: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.mergeDefaults),
/* harmony export */   mergeModels: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.mergeModels),
/* harmony export */   mergeProps: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.mergeProps),
/* harmony export */   nextTick: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.nextTick),
/* harmony export */   normalizeClass: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeClass),
/* harmony export */   normalizeProps: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeProps),
/* harmony export */   normalizeStyle: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.normalizeStyle),
/* harmony export */   onActivated: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onActivated),
/* harmony export */   onBeforeMount: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onBeforeUpdate),
/* harmony export */   onDeactivated: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onDeactivated),
/* harmony export */   onErrorCaptured: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onErrorCaptured),
/* harmony export */   onMounted: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onMounted),
/* harmony export */   onRenderTracked: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onRenderTracked),
/* harmony export */   onRenderTriggered: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onRenderTriggered),
/* harmony export */   onScopeDispose: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onScopeDispose),
/* harmony export */   onServerPrefetch: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onServerPrefetch),
/* harmony export */   onUnmounted: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onUnmounted),
/* harmony export */   onUpdated: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.onUpdated),
/* harmony export */   openBlock: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.openBlock),
/* harmony export */   popScopeId: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.popScopeId),
/* harmony export */   provide: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.provide),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.proxyRefs),
/* harmony export */   pushScopeId: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.pushScopeId),
/* harmony export */   queuePostFlushCb: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.queuePostFlushCb),
/* harmony export */   reactive: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ref),
/* harmony export */   registerRuntimeCompiler: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.registerRuntimeCompiler),
/* harmony export */   render: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   renderList: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.renderList),
/* harmony export */   renderSlot: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.renderSlot),
/* harmony export */   resolveComponent: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveComponent),
/* harmony export */   resolveDirective: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveDirective),
/* harmony export */   resolveDynamicComponent: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent),
/* harmony export */   resolveFilter: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveFilter),
/* harmony export */   resolveTransitionHooks: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.resolveTransitionHooks),
/* harmony export */   setBlockTracking: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setBlockTracking),
/* harmony export */   setDevtoolsHook: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setDevtoolsHook),
/* harmony export */   setTransitionHooks: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.setTransitionHooks),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.shallowRef),
/* harmony export */   ssrContextKey: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ssrContextKey),
/* harmony export */   ssrUtils: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.ssrUtils),
/* harmony export */   stop: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.stop),
/* harmony export */   toDisplayString: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toDisplayString),
/* harmony export */   toHandlerKey: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toHandlerKey),
/* harmony export */   toHandlers: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toHandlers),
/* harmony export */   toRaw: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toRefs),
/* harmony export */   toValue: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.toValue),
/* harmony export */   transformVNodeArgs: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.transformVNodeArgs),
/* harmony export */   triggerRef: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.triggerRef),
/* harmony export */   unref: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.unref),
/* harmony export */   useAttrs: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useAttrs),
/* harmony export */   useCssModule: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useCssModule),
/* harmony export */   useCssVars: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useCssVars),
/* harmony export */   useModel: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useModel),
/* harmony export */   useSSRContext: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useSSRContext),
/* harmony export */   useSlots: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useSlots),
/* harmony export */   useTransitionState: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.useTransitionState),
/* harmony export */   vModelCheckbox: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelCheckbox),
/* harmony export */   vModelDynamic: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelDynamic),
/* harmony export */   vModelRadio: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelRadio),
/* harmony export */   vModelSelect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelSelect),
/* harmony export */   vModelText: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vModelText),
/* harmony export */   vShow: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.vShow),
/* harmony export */   version: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.version),
/* harmony export */   warn: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.warn),
/* harmony export */   watch: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watch),
/* harmony export */   watchEffect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchEffect),
/* harmony export */   watchPostEffect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchPostEffect),
/* harmony export */   watchSyncEffect: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.watchSyncEffect),
/* harmony export */   withAsyncContext: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withAsyncContext),
/* harmony export */   withCtx: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withCtx),
/* harmony export */   withDefaults: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withDefaults),
/* harmony export */   withDirectives: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withDirectives),
/* harmony export */   withKeys: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withKeys),
/* harmony export */   withMemo: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withMemo),
/* harmony export */   withModifiers: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withModifiers),
/* harmony export */   withScopeId: () => (/* reexport safe */ _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__.withScopeId)
/* harmony export */ });
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js");



function initDev() {
  {
    (0,_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__.initCustomFormatter)();
  }
}

if (true) {
  initDev();
}
const compile = () => {
  if (true) {
    (0,_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_1__.warn)(
      `Runtime compilation is not supported in this build of Vue.` + (` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".` )
      /* should not happen */
    );
  }
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************************************!*\
  !*** ./src/vue/pages/admin/team-players/all/index.js ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
/* harmony import */ var _Table_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Table.vue */ "./src/vue/pages/admin/team-players/all/Table.vue");


var app = (0,vue__WEBPACK_IMPORTED_MODULE_0__.createApp)(_Table_vue__WEBPACK_IMPORTED_MODULE_1__["default"]);
app.mount('#root');
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUIsd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBeUM7QUFDakQsdUNBQXVDLFFBQVE7QUFDL0M7QUFDQSxXQUFXLHVEQUFVLFFBQVEsWUFBWSxJQUFJO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsTUFBTSxtREFBTTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLHFHQUFxRyw0QkFBNEIsaUJBQWlCO0FBQ2xKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHlEQUF5RDtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSLGdCQUFnQixxQkFBcUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBaUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MscURBQVE7QUFDeEMsTUFBTSxJQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxJQUF5QztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGtCQUFrQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsdUdBQXVHO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdCQUFnQjtBQUNoQyxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUF5QztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHNCQUFzQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSx1REFBVTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQSxRQUFRLEtBQXlDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0RBQU87QUFDZjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHlCQUF5QjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBeUMsR0FBRyxtREFBTSxHQUFHLGFBQWEsZUFBZSxJQUFJLENBQWlCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBeUMsR0FBRyxtREFBTSxHQUFHLGFBQWEsZUFBZSxJQUFJLENBQWlCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QyxLQUFLLHVEQUFVO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiw2Q0FBNkMsRUFBRSxrREFBUztBQUN2RjtBQUNBLE1BQU0sS0FBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdFQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLE1BQU0sc0RBQUs7QUFDWDtBQUNBLG1CQUFtQiwwREFBVztBQUM5QixJQUFJLFNBQVMsMkRBQVU7QUFDdkI7QUFDQTtBQUNBLElBQUksU0FBUyxvREFBTztBQUNwQjtBQUNBLHNDQUFzQywyREFBVSxPQUFPLDBEQUFXO0FBQ2xFO0FBQ0EsVUFBVSxzREFBSztBQUNmO0FBQ0EsUUFBUSxTQUFTLDJEQUFVO0FBQzNCO0FBQ0EsUUFBUSxTQUFTLHVEQUFVO0FBQzNCO0FBQ0EsUUFBUTtBQUNSLFFBQVEsS0FBeUM7QUFDakQ7QUFDQSxLQUFLO0FBQ0wsSUFBSSxTQUFTLHVEQUFVO0FBQ3ZCO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLGFBQWEsNkNBQUk7QUFDakIsSUFBSSxLQUF5QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw2Q0FBSTtBQUNwQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixhQUFhLDZDQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVEQUFVO0FBQzVCLFVBQVUsdURBQVU7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJEQUFjO0FBQ25DLE1BQU0sSUFBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sbURBQU07QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFEQUFRO0FBQ3pCO0FBQ0EsTUFBTSx1REFBVTtBQUNoQjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8scURBQVE7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sc0RBQUs7QUFDWDtBQUNBLElBQUksU0FBUyxvREFBTztBQUNwQixvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0E7QUFDQSxJQUFJLFNBQVMsa0RBQUssV0FBVyxrREFBSztBQUNsQztBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUksU0FBUywwREFBYTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLCtEQUFrQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQXlDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVCQUF1QjtBQUN6QyxzQ0FBc0Msa0RBQVM7QUFDL0M7QUFDQSxVQUFVLHVEQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixxQkFBcUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4REFBYTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLDhEQUFhO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBeUM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBMEM7QUFDMUQsY0FBYyxFQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzREFBSztBQUM1QixjQUFjLE9BQU87QUFDckIsVUFBVSxLQUF5QztBQUNuRCwyQ0FBMkMsS0FBSztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1CQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxnQkFBZ0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvREFBTztBQUNmO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IscUJBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04saURBQWlELEtBQUs7QUFDdEQ7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyx1REFBVTtBQUNuQjtBQUNBO0FBQ0EsMkJBQTJCLG1EQUFNLEdBQUcsb0JBQW9CLGtCQUFrQixnQkFBZ0I7QUFDMUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSx1REFBVTtBQUNoQixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxVQUFVLEtBQXlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxLQUF5QyxhQUFhLHFEQUFRLFdBQVcsdURBQVU7QUFDN0YsZ0VBQWdFLEtBQUs7QUFDckU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBLHFCQUFxQixvREFBRztBQUN4QixvQkFBb0Isb0RBQUc7QUFDdkIsc0JBQXNCLG9EQUFHO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELFFBQVE7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxVQUFVLGlDQUFpQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFrRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMkRBQWM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxVQUFVLElBQWtFO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLDJEQUFjO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxVQUFVLElBQWtFO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFO0FBQ2pFO0FBQ0EsY0FBYyx3QkFBd0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQSxJQUFJLFNBQVMscURBQVE7QUFDckI7QUFDQSxJQUFJLFNBQVMscURBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxtREFBTTtBQUNWLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4REFBYTtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDhEQUFhO0FBQ25CO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQXlDO0FBQ3RELG9CQUFvQix5REFBWTtBQUNoQztBQUNBLFNBQVMsU0FBUztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxxREFBUTtBQUNkO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELHFEQUFRLHVCQUF1Qix1REFBVSxDQUFDLHFEQUFRO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsS0FBeUM7QUFDakQ7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0IsSUFBSSxLQUFLLEVBQUUsTUFBTTtBQUNuRTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQXlDO0FBQ3REO0FBQ0EsZ0JBQWdCLHVEQUFVLHFCQUFxQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxxREFBUSxvQkFBb0IsdURBQVUsQ0FBQyxxREFBUTtBQUNoRzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPLFlBQVkscURBQVE7QUFDakM7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0EsSUFBSTtBQUNKLFFBQVEsS0FBeUM7QUFDakQsOERBQThELE9BQU87QUFDckU7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQSxJQUFJLFNBQVMscURBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IseUJBQXlCO0FBQzNDO0FBQ0EsUUFBUSxvREFBTztBQUNmLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxLQUFLO0FBQzNELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSxNQUFNLEtBQXlDLEtBQUsscURBQVE7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsSUFBSSxJQUFJLHlEQUFZO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixtREFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsS0FBeUMsR0FBRyxnRUFBZSxZQUFZLENBQU87QUFDakcsbUJBQW1CLEtBQXlDLEdBQUcsZ0VBQWUsWUFBWSxDQUFPO0FBQ2pHLG1CQUFtQixLQUF5QyxHQUFHLGdFQUFlLFlBQVksQ0FBTztBQUNqRyxrQkFBa0IsS0FBeUMsR0FBRyxnRUFBZSxXQUFXLENBQU07QUFDOUY7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLEtBQW1CLDZCQUE2QixDQUFNO0FBQzNFO0FBQ0E7QUFDQSxtQkFBbUIsS0FBbUIsMkJBQTJCLENBQUk7QUFDckUsR0FBRztBQUNIO0FBQ0E7QUFDQSxrREFBa0Qsa0RBQVMsOEJBQThCLG1EQUFNO0FBQy9GO0FBQ0EsUUFBUSxhQUFhO0FBQ3JCLFlBQVksOERBQThEO0FBQzFFLFFBQVEsS0FBeUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFFBQVEsa0JBQWtCLGtEQUFTLElBQUksbURBQU07QUFDN0M7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0Esd0RBQXdELG1EQUFNO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUJBQWlCLGtEQUFTLElBQUksbURBQU07QUFDNUM7QUFDQTtBQUNBLFFBQVEsU0FBUyxNQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQUs7QUFDYixRQUFRLEtBQXlDO0FBQ2pELFFBQVEsU0FBUyxLQUF5QztBQUMxRCxRQUFRLHNEQUFLO0FBQ2I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0saUJBQWlCLGtEQUFTLElBQUksbURBQU07QUFDMUM7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLDZEQUE2RCxtREFBTTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sU0FBUyxLQUF5QyxrQ0FBa0MscURBQVE7QUFDbEc7QUFDQTtBQUNBLG1CQUFtQixrREFBUyxnQ0FBZ0MsbURBQU07QUFDbEU7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxhQUFhO0FBQ2I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxzQkFBc0IscUJBQXFCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxRQUFRLGFBQWE7QUFDckIsWUFBWSx3QkFBd0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsTUFBTSxTQUFTLEtBQXlDLGtDQUFrQyxtREFBTTtBQUNoRyxvREFBb0QsSUFBSTtBQUN4RDtBQUNBLE1BQU0sa0JBQWtCLGtEQUFTLElBQUksbURBQU07QUFDM0M7QUFDQTtBQUNBLE1BQU0sU0FBUyxtREFBTTtBQUNyQixNQUFNLEtBQXlDLHVDQUF1QyxJQUFJO0FBQzFGO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBeUM7QUFDL0MsaURBQWlELElBQUk7QUFDckQ7QUFDQTtBQUNBLE1BQU07QUFDTixVQUFVLEtBQXlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLFNBQVM7QUFDVCxHQUFHO0FBQ0g7QUFDQSwwQ0FBMEMsa0RBQVMsSUFBSSxtREFBTSwwRkFBMEYsbURBQU0sMEJBQTBCLG1EQUFNLGNBQWMsbURBQU0sOEJBQThCLG1EQUFNO0FBQ3JQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxNQUFNLFNBQVMsbURBQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBaUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsbURBQU07QUFDekUsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUNBQXFDLGtFQUFxQjtBQUMxRCxVQUFVLEtBQXlDO0FBQ25EO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsNkNBQUk7QUFDZixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDZDQUFJO0FBQ2pCLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsVUFBVSxrQkFBa0I7QUFDNUIsY0FBYyxzREFBSztBQUNuQjtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLDZDQUFJO0FBQ2pCLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLEtBQUssT0FBTztBQUNaO0FBQ0E7QUFDQSxNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBeUM7QUFDL0M7QUFDQSxXQUFXLG9EQUFHO0FBQ2Q7QUFDQSxNQUFNLEtBQXlDO0FBQy9DLHlDQUF5QyxLQUFLO0FBQzlDLFdBQVcsb0RBQUc7QUFDZDtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFHO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixLQUFLO0FBQzlCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EseUJBQXlCLEtBQUs7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxvREFBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxvREFBTyxTQUFTLHVEQUFVO0FBQ3BDLDZCQUE2QjtBQUM3QixRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTiwyQkFBMkI7QUFDM0IsTUFBTSxTQUFTLElBQXlDO0FBQ3hELGlDQUFpQyxJQUFJO0FBQ3JDO0FBQ0Esa0NBQWtDLElBQUk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sb0RBQU8sT0FBTyxvREFBTztBQUMzQjtBQUNBLFNBQVMsbURBQU0sR0FBRztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxzREFBUztBQUNmO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE1BQU0sWUFBWSxJQUFJLDBCQUEwQixXQUFXO0FBQ3pFLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osbUNBQW1DLEtBQXlDLDhCQUE4QixDQUFJO0FBQzlHLE1BQU0sSUFBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLHVEQUFVO0FBQ3BCLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxVQUFVLEtBQUssRUFFTjtBQUNULFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBLFFBQVEsU0FBUyxJQUF5QztBQUMxRDtBQUNBLHFCQUFxQixJQUFJLGNBQWMscUJBQXFCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEtBQXlDLEtBQUssdURBQVU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsS0FBeUMsSUFBSSxzREFBUztBQUM5RDtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBO0FBQ0EsU0FBUyxxREFBUTtBQUNqQixNQUFNLEtBQXlDO0FBQy9DLE1BQU07QUFDTixzQkFBc0IseURBQVE7QUFDOUIsVUFBVSxJQUF5QztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw2Q0FBSTtBQUN2QixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVEQUFVLDJDQUEyQyx1REFBVSxtREFBbUQsNkNBQUk7QUFDeEksVUFBVSxLQUF5QyxZQUFZLDZDQUFJO0FBQ25FLG1DQUFtQyxJQUFJO0FBQ3ZDO0FBQ0EsbUJBQW1CLHVEQUFVLFNBQVMsdURBQVUsdUNBQXVDLEtBQXlDO0FBQ2hJO0FBQ0Esd0RBQXdELElBQUk7QUFDNUQ7QUFDQSxRQUFRLEVBQUUsQ0FBSTtBQUNkO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLFVBQVUsSUFBeUM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsdURBQVU7QUFDL0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvREFBTztBQUNmO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sb0RBQU87QUFDYjtBQUNBLGdFQUFnRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyw2Q0FBSTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBFQUEwRSw2Q0FBSTtBQUM5RSxNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEscURBQVE7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUSxzREFBSztBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRLElBQXlDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksb0RBQU87QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHFEQUFRO0FBQ2Q7QUFDQSxRQUFRLHVEQUFVO0FBQ2xCO0FBQ0EsTUFBTSxTQUFTLElBQXlDO0FBQ3hELHNEQUFzRCxJQUFJO0FBQzFEO0FBQ0EsSUFBSSxTQUFTLHVEQUFVO0FBQ3ZCO0FBQ0EsSUFBSSxTQUFTLHFEQUFRO0FBQ3JCLFFBQVEsb0RBQU87QUFDZjtBQUNBLE1BQU07QUFDTixzQkFBc0IsdURBQVU7QUFDaEMsVUFBVSx1REFBVTtBQUNwQjtBQUNBLFFBQVEsU0FBUyxJQUF5QztBQUMxRCx3REFBd0QsWUFBWTtBQUNwRTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQXlDO0FBQ3RELG1DQUFtQyxJQUFJO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxrQ0FBa0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0scURBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxrQ0FBa0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtREFBTTtBQUNsQixNQUFNLHVEQUFVO0FBQ2hCLE1BQU0sdURBQVU7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQSxvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxtREFBTTtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9EQUFPLFFBQVEsb0RBQU87QUFDOUI7QUFDQTtBQUNBLFdBQVcsbURBQU07QUFDakI7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1EQUFNO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkNBQUU7QUFDckI7QUFDQSwwQkFBMEI7QUFDMUIsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx1REFBVTtBQUNuQixzQkFBc0IsbURBQU0sR0FBRztBQUMvQjtBQUNBLDhCQUE4QixxREFBUTtBQUN0QyxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBeUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxVQUFVLEtBQXlDO0FBQ25ELFVBQVUsbUJBQW1CLHVEQUFVO0FBQ3ZDO0FBQ0E7QUFDQSxVQUFVLFNBQVMsdURBQVU7QUFDN0I7QUFDQTtBQUNBLFVBQVUsU0FBUyxJQUF5QztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsWUFBWSxJQUFtQjtBQUMvQjtBQUNBO0FBQ0EsWUFBWSxTQUFTLElBQXlDO0FBQzlEO0FBQ0Esa0ZBQWtGLFdBQVc7QUFDN0Y7QUFDQTtBQUNBLFVBQVUsS0FBSyxFQUVOO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQSxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLEtBQXlDO0FBQ3JELDZCQUE2QixLQUFLO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksS0FBeUM7QUFDckQsNkJBQTZCLEtBQUs7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxjQUFjLEtBQXlDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxJQUF5QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsSUFBa0U7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFNBQVMsSUFBeUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxjQUFjLElBQWtFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxTQUFTLElBQXlDO0FBQzVEO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxZQUFZLEtBQXlDO0FBQ3JEO0FBQ0EsdURBQXVELFlBQVk7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxJQUF5QztBQUNqRDtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sc0NBQXNDLHVEQUFVO0FBQ2hELE1BQU0sU0FBUyxJQUF5QztBQUN4RCx5QkFBeUIsWUFBWTtBQUNyQztBQUNBLElBQUksU0FBUyxJQUF5QztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRSxnREFBRztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUF5QztBQUMvQyxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBLHFDQUFxQyxnRUFBZTtBQUNwRCxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixJQUFJO0FBQ0osMEJBQTBCLHNEQUFLO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDBCQUEwQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1EQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaLGlDQUFpQyxxREFBUTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1EQUFNO0FBQ2I7QUFDQSxtQkFBbUIsc0RBQVMsbUJBQW1CLG1EQUFNO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1EQUFNO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx3REFBTztBQUNYO0FBQ0EsTUFBTSxJQUF5QztBQUMvQyxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMkRBQWM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsbURBQU0scUJBQXFCLHFEQUFRO0FBQ3hEO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsK0NBQStDO0FBQy9DO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0RBQUs7QUFDakMsd0NBQXdDLGtEQUFTO0FBQ2pELG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLG1EQUFNO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtREFBTTtBQUM3QjtBQUNBO0FBQ0EsdURBQXVELHVEQUFVO0FBQ2pFLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLG1FQUFtRSxzREFBUztBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBbUIsS0FBSyx1REFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxNQUFNLG1EQUFNO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEscURBQVE7QUFDaEIsc0JBQXNCLGtEQUFTO0FBQy9CO0FBQ0EsV0FBVyxrREFBUztBQUNwQjtBQUNBLE1BQU0sb0RBQU87QUFDYixvQkFBb0IsZ0JBQWdCO0FBQ3BDLFVBQVUsS0FBeUMsS0FBSyxxREFBUTtBQUNoRTtBQUNBO0FBQ0EsNEJBQTRCLHFEQUFRO0FBQ3BDO0FBQ0Esb0NBQW9DLGtEQUFTO0FBQzdDO0FBQ0E7QUFDQSxJQUFJO0FBQ0osUUFBUSxLQUF5QyxLQUFLLHFEQUFRO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixxREFBUTtBQUNwQztBQUNBO0FBQ0EsaURBQWlELG9EQUFPLFNBQVMsdURBQVUsVUFBVSxZQUFZLEVBQUUsbURBQU0sR0FBRztBQUM1RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG1EQUFNO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxxREFBUTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQXlDO0FBQ3RELGdDQUFnQyxJQUFJO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQSxJQUFJLFNBQVMsdURBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixzREFBSztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1EQUFNLG9CQUFvQixtREFBTSxXQUFXLHNEQUFTO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSx1Q0FBdUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFPO0FBQ3pCO0FBQ0Esb0JBQW9CLDhCQUE4QjtBQUNsRCxjQUFjLHNCQUFzQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsb0RBQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixZQUFZLHFEQUFRO0FBQ3BCLElBQUk7QUFDSixZQUFZLG9EQUFPO0FBQ25CLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELEtBQUssY0FBYyxrQkFBa0IsbURBQVUsY0FBYztBQUMxSDtBQUNBLHVCQUF1QixzREFBUztBQUNoQztBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsY0FBYztBQUM1QztBQUNBLHNCQUFzQixjQUFjO0FBQ3BDO0FBQ0EsNkJBQTZCLGNBQWM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQixJQUFJO0FBQ0osY0FBYyxjQUFjO0FBQzVCLElBQUk7QUFDSixjQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0NBQXNDLG9EQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEtBQXlDO0FBQ2pEO0FBQ0EsaUJBQWlCLElBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdURBQVU7QUFDbEI7QUFDQSxNQUFNO0FBQ04sVUFBVSxJQUFpRDtBQUMzRDtBQUNBLHNEQUFzRCxJQUFJO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0RBQUs7QUFDNUIsTUFBTSxnREFBRztBQUNULE1BQU07QUFDTjtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGdEQUFHO0FBQ0w7QUFDQTtBQUNBLFVBQVUsZUFBZTtBQUN6QjtBQUNBLGlDQUFpQyxrREFBUztBQUMxQztBQUNBO0FBQ0E7QUFDQSxVQUFVLEtBQXlDO0FBQ25ELFFBQVEsbURBQU07QUFDZCxRQUFRLHdEQUFPO0FBQ2YsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSLFFBQVEsbURBQU07QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG9EQUFPO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsbUJBQW1CO0FBQzdCLE1BQU0sS0FBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGtEQUFTLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0EsUUFBUSxxREFBUTtBQUNoQjtBQUNBLFVBQVUsbURBQU07QUFDaEI7QUFDQTtBQUNBLE1BQU0sU0FBUyxzREFBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLHVEQUFVO0FBQ2hCO0FBQ0EsSUFBSTtBQUNKLHNCQUFzQixxREFBUTtBQUM5QixtQkFBbUIsc0RBQUs7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLG1EQUFNO0FBQzdDO0FBQ0EsWUFBWSxvREFBTyxjQUFjLG1EQUFNO0FBQ3ZDLFlBQVk7QUFDWixpQkFBaUIsb0RBQU87QUFDeEI7QUFDQTtBQUNBLG9CQUFvQixtREFBTTtBQUMxQjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLGNBQWMsbURBQU07QUFDcEI7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxVQUFVLFNBQVMsSUFBeUM7QUFDNUQsc0RBQXNELFdBQVc7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTSxTQUFTLElBQXlDO0FBQ3hELGtEQUFrRCxXQUFXO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTSxLQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0NBQWtDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFlBQVksS0FBeUM7QUFDckQ7QUFDQSxZQUFZO0FBQ1osWUFBWSwrQkFBK0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsU0FBUyxJQUF5QztBQUM1RCxvREFBb0QsWUFBWTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDBDQUEwQztBQUN0RDtBQUNBLFFBQVEsSUFBZ0Y7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELGlEQUFJLFVBQVUsMkRBQWM7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLEtBQXlDO0FBQ3ZEO0FBQ0EsaURBQWlELFdBQVc7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVUsS0FBeUM7QUFDbkQsbURBQW1ELFdBQVc7QUFDOUQsWUFBWTtBQUNaLFlBQVksZUFBZTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBLFlBQVksS0FBeUM7QUFDckQ7QUFDQSwrQ0FBK0MsZ0NBQWdDO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVkscUNBQXFDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBeUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLEtBQUssR0FBRyxhQUFhO0FBQzFDO0FBQ0EsTUFBTSxJQUFrRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLEtBQUssR0FBRyxhQUFhO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLFVBQVUsNkNBQTZDLElBQUksS0FBSztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQWtFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLEtBQXdDLEVBQUUsRUFHN0M7QUFDSCxNQUFNLEtBQTBDLEVBQUUsRUFHL0M7QUFDSCxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQSxxQkFBcUIsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsc0JBQXNCOztBQUV0RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDBEQUFhO0FBQzlCO0FBQ0EsTUFBTSxJQUFrRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyw2Q0FBSTtBQUNyQztBQUNBLElBQUk7QUFDSixrSkFBa0osS0FBeUM7QUFDM0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx1QkFBdUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFNBQVMsSUFBeUM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLFNBQVMsSUFBeUM7QUFDNUQsZ0RBQWdELFlBQVk7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsWUFBWTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksMkNBQTJDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQywyREFBYztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFrRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLEtBQXlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1DQUFtQztBQUM3QztBQUNBLGlDQUFpQyxrREFBUztBQUMxQyxpQ0FBaUMsa0RBQVM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUF5QztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQXlDO0FBQ25EO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwQkFBMEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrREFBUztBQUNoQztBQUNBLGVBQWUsMkRBQWM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSwyREFBYztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsaUVBQWlFO0FBQzNFLFFBQVEsS0FBeUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQSxVQUFVLEtBQUssRUFhTjtBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLEtBQXlDO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRLElBQXlDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxJQUF5QztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxVQUFVLElBQXlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQXlDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QixnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMkRBQWM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBeUM7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLElBQXlDO0FBQ3pEO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBeUM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLElBQXlDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFVBQVU7QUFDVixjQUFjLElBQXlDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBLGNBQWMsSUFBeUM7QUFDdkQ7QUFDQTtBQUNBLGNBQWMsSUFBeUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsSUFBeUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFrRTtBQUM5RTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsY0FBYyw2QkFBNkI7QUFDM0M7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMkRBQWM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUF5QztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBa0U7QUFDOUU7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsMkRBQWM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBeUM7QUFDakQsNkNBQTZDLDJEQUFjO0FBQzNELCtDQUErQywyREFBYztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSw4REFBYTtBQUNqQjtBQUNBLElBQUksOERBQWE7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksdUJBQXVCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGtEQUFTO0FBQ3hCLGVBQWUsa0RBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBLGNBQWMsS0FBeUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsdUJBQXVCLFNBQVM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRkFBc0Ysa0RBQVM7QUFDL0Y7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksNENBQTRDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IscUJBQXFCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixnQkFBZ0IsZ0NBQWdDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBLFVBQVUsS0FBeUM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsb0JBQW9CO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUF5QztBQUNqRDtBQUNBO0FBQ0EsWUFBWSxrQ0FBa0M7QUFDOUM7QUFDQSxNQUFNLDJEQUFjO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFrRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixnQkFBZ0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sb0RBQU8sU0FBUyxvREFBTztBQUM3QixvQkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxLQUF5QztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLHFEQUFRO0FBQ2Q7QUFDQSxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUSxLQUF5QztBQUNqRCw2REFBNkQsZUFBZTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixRQUFRLEtBQXlDO0FBQ2pELHVDQUF1QyxlQUFlO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsTUFBTTtBQUNOO0FBQ0EsVUFBVSx1Q0FBdUM7QUFDakQsUUFBUSxLQUF5QztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxLQUF5QyxxQ0FBcUMsQ0FBYztBQUM5SCxxQ0FBcUMsS0FBeUMsbUNBQW1DLENBQWM7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFNBQVMsS0FBeUM7QUFDMUQsOERBQThELGNBQWM7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxTQUFTLElBQXlDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCw4REFBOEQsa0JBQWtCLHNCQUFzQjtBQUN0RyxZQUFZLDJEQUEyRDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IscUJBQXFCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELEtBQUssUUFBUSxXQUFXO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUNBQXlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixxQkFBcUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLGtEQUFTO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixLQUFLO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxREFBUSxTQUFTLHNEQUFLLFNBQVMsdURBQVUsVUFBVSxnRUFBZ0U7QUFDMUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSix1QkFBdUIscURBQVE7QUFDL0I7QUFDQSxNQUFNLEtBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixLQUF5QyxrQ0FBa0MsQ0FBWTtBQUMzRztBQUNBO0FBQ0EsUUFBUSxLQUF5QztBQUNqRCxzREFBc0QsS0FBSztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxzQkFBc0I7QUFDaEMsa0JBQWtCLHFEQUFRO0FBQzFCLG9CQUFvQiwyREFBYztBQUNsQztBQUNBLFFBQVEscURBQVE7QUFDaEIsVUFBVSx3REFBTyxZQUFZLG9EQUFPO0FBQ3BDLGdCQUFnQixtREFBTSxHQUFHO0FBQ3pCO0FBQ0Esb0JBQW9CLDJEQUFjO0FBQ2xDO0FBQ0E7QUFDQSxvQkFBb0IscURBQVEsOERBQThELHFEQUFRLGFBQWEsdURBQVU7QUFDekgsTUFBTSxLQUF5QyxxQkFBcUIsd0RBQU87QUFDM0UsV0FBVyxzREFBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHdEQUFPLHdDQUF3QyxtREFBTSxHQUFHO0FBQ2pFO0FBQ0E7QUFDQSxVQUFVLGtDQUFrQztBQUM1Qyx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isb0RBQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsY0FBYyxLQUF5Qyx3QkFBd0Isb0RBQU87QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLG9EQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxZQUFZO0FBQ3RCO0FBQ0E7QUFDQSxJQUFJLFNBQVMsb0RBQU87QUFDcEI7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsdURBQVU7QUFDdkIsaUJBQWlCO0FBQ2pCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDJEQUFjO0FBQ3BDO0FBQ0EsUUFBUTtBQUNSLG9CQUFvQiwyREFBYztBQUNsQyxRQUFRLFNBQVMsaURBQUk7QUFDckI7QUFDQTtBQUNBLG1EQUFtRCxvREFBTztBQUMxRDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsd0RBQVc7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsa0RBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrREFBUztBQUNsQixVQUFVLGtEQUFTO0FBQ25CLFdBQVcsa0RBQVM7QUFDcEIsV0FBVyxrREFBUztBQUNwQixXQUFXLGtEQUFTO0FBQ3BCLFVBQVUsa0RBQVM7QUFDbkIsZ0JBQWdCLGtEQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUF5QztBQUMvQztBQUNBLElBQUksS0FBSyxFQUVOO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsMERBQWE7QUFDcEQsbUNBQW1DLDBEQUFhO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLG9EQUFPO0FBQzVDO0FBQ0EsK0NBQStDLDJDQUFFO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsa0JBQWtCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGtCQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGtCQUFrQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQix3REFBTztBQUMxQixNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQSxVQUFVLFFBQVE7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsSUFBSSw4REFBYTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sS0FBeUMsR0FBRyxnRUFBZSxtQkFBbUIsQ0FBYztBQUNuRztBQUNBLElBQUksOERBQWE7QUFDakI7QUFDQSxRQUFRLHNEQUFTO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBLFlBQVksS0FBeUM7QUFDckQ7QUFDQTtBQUNBLDBCQUEwQixLQUFLO0FBQy9CO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSx1REFBVTtBQUNoQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJLFNBQVMscURBQVE7QUFDckIsUUFBUSxLQUF5QztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBa0U7QUFDMUU7QUFDQTtBQUNBLDBCQUEwQiwwREFBUztBQUNuQyxRQUFRLElBQXlDO0FBQ2pEO0FBQ0E7QUFDQSxJQUFJLFNBQVMsS0FBeUM7QUFDdEQ7QUFDQSxvREFBb0QsbURBQW1EO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBLGdCQUFnQixtQ0FBbUM7QUFDbkQsZ0JBQWdCLHdEQUF3RDtBQUN4RSxxQ0FBcUMsbURBQU07QUFDM0MsVUFBVSxtREFBTTtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsNkNBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQTJCO0FBQ2pDO0FBQ0EsSUFBSSw4REFBYTtBQUNqQjtBQUNBLElBQUksOERBQWE7QUFDakI7QUFDQTtBQUNBLE1BQU0sS0FBeUMsNkNBQTZDLDZDQUFJO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQXlDO0FBQzdDO0FBQ0E7QUFDQSxRQUFRLHNEQUFLO0FBQ2I7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxFQUFFLENBS0g7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxzREFBSztBQUNYO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUF5QztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG9EQUFPO0FBQ3JCO0FBQ0EsWUFBWSxTQUFTLHNEQUFLO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsWUFBWTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQXlDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0wsSUFBSSxLQUFLLEVBU047QUFDSDtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsMERBQVMsQ0FBQyx3REFBTztBQUN0RjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsdURBQVU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx1REFBVTtBQUNuQjs7QUFFQTtBQUNBLFNBQVMseURBQVU7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxxREFBUSxzQkFBc0Isb0RBQU87QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sTUFBMEM7QUFDaEQ7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQix3QkFBd0I7QUFDeEIsd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsV0FBVyxxREFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsU0FBUyxzREFBSztBQUN0QjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFNBQVMsMkRBQVU7QUFDM0I7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxjQUFjLDJEQUFVLDJCQUEyQjtBQUNuRDtBQUNBLFFBQVEsU0FBUywyREFBVTtBQUMzQjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxzREFBSztBQUNwRDtBQUNBLGdDQUFnQyxrREFBUztBQUN6QztBQUNBO0FBQ0EsMEJBQTBCLGtEQUFTO0FBQ25DLDhDQUE4QyxzREFBSztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1EQUFNLEdBQUc7QUFDdEI7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsUUFBUSwyQkFBMkIsc0JBQXNCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU0sU0FBUyxxREFBUTtBQUN2QiwwQkFBMEIsZ0JBQWdCLHNEQUFLLFNBQVM7QUFDeEQsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVEQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0RBQU8sZ0NBQWdDLHFEQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DLFFBQVEsdURBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWsrQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzalB4akM7QUFDeFk7QUFDc1E7O0FBRXhTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsdUZBQXVGLEtBQUs7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixvREFBb0QsUUFBUTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IscURBQVE7QUFDOUI7QUFDQSxpQkFBaUIscURBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLE1BQU0sb0RBQU87QUFDYjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsUUFBUSxJQUF5QztBQUNqRDtBQUNBLFFBQVEsdURBQUk7QUFDWixpREFBaUQsS0FBSyxrQkFBa0IsSUFBSTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLFVBQVUsc0RBQVM7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscURBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsU0FBUyx1REFBVTtBQUNuQixrQkFBa0IscUJBQXFCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSixzQkFBc0IsaUVBQW9CO0FBQzFDLHVDQUF1QywrREFBa0I7QUFDekQ7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsK0RBQWtCO0FBQ2hDLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixRQUFRLEtBQXlDO0FBQ2pELE1BQU0sdURBQUk7QUFDVixnQ0FBZ0MsSUFBSSxRQUFRLGtCQUFrQixXQUFXLE9BQU87QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxzREFBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUksNkVBQTBCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLG9EQUFPO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUksU0FBUyxpREFBSTtBQUNqQixTQUFTLDREQUFlO0FBQ3hCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsdURBQVU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIscURBQVE7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLGtFQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLFVBQVUsS0FBeUM7QUFDbkQsUUFBUSx1REFBSTtBQUNaO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixjQUFjO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksMkRBQVE7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssa0JBQWtCLGtCQUFrQjtBQUN6QztBQUNBLGNBQWMsZ0JBQWdCO0FBQzlCO0FBQ0Esb0JBQW9CLG9EQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHFEQUFRO0FBQ3pDO0FBQ0EsaUZBQWlGLHFEQUFVO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLDZCQUE2QixvREFBTyx5Q0FBeUM7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxpREFBVTtBQUNyRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFEQUFVO0FBQy9CO0FBQ0EsY0FBYyxxREFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHNEQUFTO0FBQ3JDLFVBQVU7QUFDViw0QkFBNEIsc0RBQVM7QUFDckMsVUFBVTtBQUNWLCtCQUErQixzREFBUztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDhEQUFXLFlBQVksbURBQU0sR0FBRztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBeUM7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsc0RBQVM7QUFDdkIscUJBQXFCLHNEQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLElBQXlDO0FBQ3JEO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIscUVBQWtCO0FBQ3ZDO0FBQ0EsTUFBTSxLQUF5QyxJQUFJLHVEQUFJO0FBQ3ZELGFBQWEsa0RBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QyxJQUFJLHVEQUFJO0FBQ3ZELGFBQWEsa0RBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QyxJQUFJLHVEQUFJLHFEQUFxRCxLQUFLO0FBQ2pILGFBQWEsa0RBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIscUVBQWtCO0FBQ3JDO0FBQ0EsSUFBSSxLQUF5QyxJQUFJLHVEQUFJO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGFBQWE7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGtFQUFlO0FBQ2pCLEVBQUUsNERBQVM7QUFDWDtBQUNBLGlEQUFpRCxpQkFBaUI7QUFDbEUsSUFBSSw4REFBVztBQUNmLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx3QkFBd0IsdURBQVE7QUFDcEM7QUFDQSxJQUFJLHdCQUF3QixxREFBTTtBQUNsQyxVQUFVLGFBQWE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLElBQUk7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2QkFBNkIsT0FBTyxLQUFLLG9EQUFDLENBQUMsNkRBQWM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRSxtREFBTTtBQUMzRSxJQUFJO0FBQ0osRUFBRSw0RUFBNkI7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsTUFBTSxvREFBTztBQUNiO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG9EQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixLQUFLO0FBQzdCLDBCQUEwQixLQUFLO0FBQy9CLHNCQUFzQixLQUFLO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixLQUFLO0FBQzdCLDBCQUEwQixLQUFLO0FBQy9CLHNCQUFzQixLQUFLO0FBQzNCLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUyxtREFBTTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksU0FBUyxxREFBUTtBQUNyQjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxxREFBUTtBQUN0QixNQUFNLElBQXlDO0FBQy9DLElBQUksK0RBQVk7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxPQUFPO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsMkJBQTJCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELFdBQVc7QUFDNUQsb0RBQW9ELFdBQVc7QUFDL0Q7QUFDQSxnREFBZ0QsVUFBVTtBQUMxRCxtREFBbUQsVUFBVTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLG1EQUFNLEdBQUc7QUFDbEM7QUFDQTtBQUNBLEdBQUc7QUFDSCxpQkFBaUIsT0FBTztBQUN4QixxQkFBcUIscUVBQWtCO0FBQ3ZDLGtCQUFrQixxRUFBa0I7QUFDcEM7QUFDQTtBQUNBLElBQUksNERBQVM7QUFDYjtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsa0JBQWtCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSx1QkFBdUIsd0RBQUs7QUFDNUI7QUFDQSxnQ0FBZ0MsdURBQVE7QUFDeEM7QUFDQSxpQ0FBaUMsMkVBQXdCO0FBQ3pELHNCQUFzQixxQkFBcUI7QUFDM0M7QUFDQTtBQUNBLFVBQVUscUVBQWtCO0FBQzVCO0FBQ0EsWUFBWSx5RUFBc0I7QUFDbEM7QUFDQSxVQUFVLFNBQVMsSUFBeUM7QUFDNUQsVUFBVSx1REFBSTtBQUNkO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5QkFBeUI7QUFDakQ7QUFDQSxVQUFVLHFFQUFrQjtBQUM1QjtBQUNBLFlBQVkseUVBQXNCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw4REFBVztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxHQUFHLEtBQUssR0FBRztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZUFBZTtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsb0RBQU8sa0JBQWtCLDJEQUFjO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixhQUFhLHNCQUFzQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwwREFBYTtBQUNoQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QjtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsb0JBQW9CLHNCQUFzQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QywwREFBYTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsb0RBQU87QUFDakIsc0JBQXNCLHlEQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsU0FBUyxrREFBSztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBLE1BQU0sb0RBQU87QUFDYixpQkFBaUIseURBQVk7QUFDN0IsSUFBSSxTQUFTLGtEQUFLO0FBQ2xCO0FBQ0EsSUFBSTtBQUNKLGlCQUFpQix1REFBVTtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QixpQkFBaUIsdURBQVU7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQSxtQkFBbUIsdURBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG9CQUFvQixVQUFVO0FBQzlDLHVCQUF1QixrREFBSztBQUM1QjtBQUNBO0FBQ0Esd0JBQXdCLDBEQUFhO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNILGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsb0RBQU8sWUFBWSxrREFBSztBQUM3QyxJQUFJLEtBQXlDLElBQUksdURBQUk7QUFDckQsMEZBQTBGLG1EQUFtRDtBQUM3STtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsT0FBTztBQUNoRDtBQUNBO0FBQ0E7QUFDQSxVQUFVLG9EQUFPO0FBQ2pCLDBCQUEwQix5REFBWTtBQUN0QyxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTixVQUFVLHVEQUFVO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixPQUFPLFFBQVEsT0FBTztBQUNwRCwrQkFBK0IsT0FBTztBQUN0Qyx1QkFBdUIsdURBQVU7QUFDakMsZUFBZTtBQUNmO0FBQ0E7QUFDQSxrQ0FBa0MsT0FBTztBQUN6QyxRQUFRLG9EQUFPO0FBQ2YseUJBQXlCLHlEQUFZO0FBQ3JDLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU0sU0FBUyxrREFBSztBQUNwQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU07QUFDTixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0RBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixPQUFPLElBQUksWUFBWTtBQUMzQztBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSCxnQkFBZ0IsT0FBTyxJQUFJLFlBQVk7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGdCQUFnQixpQkFBaUIsSUFBSSxZQUFZO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSCxzQkFBc0IsT0FBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixPQUFPO0FBQ2hDO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0MsbURBQU0sR0FBRyxXQUFXO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxpRUFBYztBQUMvQztBQUNBO0FBQ0EsMkNBQTJDLDBFQUF1QjtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUF5QztBQUMvQztBQUNBO0FBQ0E7QUFDQSxVQUFVLFFBQVE7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsdURBQVU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBeUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsVUFBVSxRQUFRO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNEQUFTLFNBQVMscURBQVE7QUFDOUM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLE1BQU0sZ0VBQWE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxRQUFRLHVEQUFJO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1REFBSTtBQUNaO0FBQ0EsT0FBTztBQUNQO0FBQ0EsUUFBUSx1REFBSTtBQUNaO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE1BQU0scURBQVE7QUFDZDtBQUNBLFFBQVEsS0FBeUM7QUFDakQsTUFBTSx1REFBSTtBQUNWLHVEQUF1RCxVQUFVO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxLQUF5QztBQUMvQyxJQUFJLHVEQUFJO0FBQ1Isd0NBQXdDLGVBQWU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVnUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzMrQ2hTO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLEtBQXlDLG1CQUFtQixJQUFJLENBQUU7QUFDcEYsa0JBQWtCLEtBQXlDLHVCQUF1QixDQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGdCQUFnQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsZ0JBQWdCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZLQUE2SyxxQkFBTSxtQkFBbUIscUJBQU0sS0FBSztBQUNqTjtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsS0FBSyxlQUFlLHFCQUFxQjtBQUNsRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQSw4QkFBOEIsK0JBQStCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLLEVBQUUsaURBQWlELEtBQUssU0FBUztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGNBQWMsR0FBRyxPQUFPO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNCQUFzQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxLQUFLO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG9CQUFvQjtBQUNoRDtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLGNBQWMsU0FBUztBQUN2QixtQkFBbUIsS0FBSztBQUN4QjtBQUNBLE9BQU8sSUFBSTtBQUNYO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUV1ekI7Ozs7Ozs7Ozs7Ozs7OztBQ2hacnpCLGlFQUFlLENBRWYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFQQ0EsdURBQUEsQ0FBb0IsWUFBaEIsYUFBVztrQkFBZkMsVUFBb0I7OzJEQUR0QkMsdURBQUEsQ0FFTSxhQUFBQyxVQUFBOzs7Ozs7Ozs7OztBQ0hLO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdEO0FBQ0E7QUFDQSxrQkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVmtFO0FBQ1Y7QUFDTDs7QUFFbkQsQ0FBNEY7QUFDNUYsaUNBQWlDLHlGQUFlLENBQUMsMEVBQU0sYUFBYSw0RUFBTTtBQUMxRTtBQUNBLElBQUksS0FBVSxFQUFFLEVBWWY7OztBQUdELGlFQUFlOzs7Ozs7Ozs7Ozs7Ozs7QUN0Qm9OOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFQXRLO0FBQzVCOztBQUVqQztBQUNBO0FBQ0EsSUFBSSxxRUFBbUI7QUFDdkI7QUFDQTs7QUFFQSxJQUFJLElBQXlDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBeUM7QUFDL0MsSUFBSSxzREFBSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRW1COzs7Ozs7O1VDckJuQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05nQztBQUNEO0FBRS9CLElBQU1HLEdBQUcsR0FBR0YsOENBQVMsQ0FBQ0Msa0RBQUssQ0FBQztBQUM1QkMsR0FBRyxDQUFDQyxLQUFLLENBQUMsT0FBTyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9AdnVlL3JlYWN0aXZpdHkvZGlzdC9yZWFjdGl2aXR5LmVzbS1idW5kbGVyLmpzIiwid2VicGFjazovL2Zyb250ZW5kLy4vbm9kZV9tb2R1bGVzL0B2dWUvcnVudGltZS1jb3JlL2Rpc3QvcnVudGltZS1jb3JlLmVzbS1idW5kbGVyLmpzIiwid2VicGFjazovL2Zyb250ZW5kLy4vbm9kZV9tb2R1bGVzL0B2dWUvcnVudGltZS1kb20vZGlzdC9ydW50aW1lLWRvbS5lc20tYnVuZGxlci5qcyIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9AdnVlL3NoYXJlZC9kaXN0L3NoYXJlZC5lc20tYnVuZGxlci5qcyIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL3NyYy92dWUvcGFnZXMvYWRtaW4vdGVhbS1wbGF5ZXJzL2FsbC9UYWJsZS52dWUiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2V4cG9ydEhlbHBlci5qcyIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL3NyYy92dWUvcGFnZXMvYWRtaW4vdGVhbS1wbGF5ZXJzL2FsbC9UYWJsZS52dWU/MmFmMCIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL3NyYy92dWUvcGFnZXMvYWRtaW4vdGVhbS1wbGF5ZXJzL2FsbC9UYWJsZS52dWU/YzdlZCIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL3NyYy92dWUvcGFnZXMvYWRtaW4vdGVhbS1wbGF5ZXJzL2FsbC9UYWJsZS52dWU/MjEzNCIsIndlYnBhY2s6Ly9mcm9udGVuZC8uL25vZGVfbW9kdWxlcy92dWUvZGlzdC92dWUucnVudGltZS5lc20tYnVuZGxlci5qcyIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Zyb250ZW5kL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9zcmMvdnVlL3BhZ2VzL2FkbWluL3RlYW0tcGxheWVycy9hbGwvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXh0ZW5kLCBpc0FycmF5LCBpc01hcCwgaXNJbnRlZ2VyS2V5LCBoYXNPd24sIGlzU3ltYm9sLCBpc09iamVjdCwgaGFzQ2hhbmdlZCwgbWFrZU1hcCwgY2FwaXRhbGl6ZSwgdG9SYXdUeXBlLCBkZWYsIGlzRnVuY3Rpb24sIE5PT1AgfSBmcm9tICdAdnVlL3NoYXJlZCc7XG5cbmZ1bmN0aW9uIHdhcm4obXNnLCAuLi5hcmdzKSB7XG4gIGNvbnNvbGUud2FybihgW1Z1ZSB3YXJuXSAke21zZ31gLCAuLi5hcmdzKTtcbn1cblxubGV0IGFjdGl2ZUVmZmVjdFNjb3BlO1xuY2xhc3MgRWZmZWN0U2NvcGUge1xuICBjb25zdHJ1Y3RvcihkZXRhY2hlZCA9IGZhbHNlKSB7XG4gICAgdGhpcy5kZXRhY2hlZCA9IGRldGFjaGVkO1xuICAgIC8qKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG4gICAgLyoqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdGhpcy5lZmZlY3RzID0gW107XG4gICAgLyoqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdGhpcy5jbGVhbnVwcyA9IFtdO1xuICAgIHRoaXMucGFyZW50ID0gYWN0aXZlRWZmZWN0U2NvcGU7XG4gICAgaWYgKCFkZXRhY2hlZCAmJiBhY3RpdmVFZmZlY3RTY29wZSkge1xuICAgICAgdGhpcy5pbmRleCA9IChhY3RpdmVFZmZlY3RTY29wZS5zY29wZXMgfHwgKGFjdGl2ZUVmZmVjdFNjb3BlLnNjb3BlcyA9IFtdKSkucHVzaChcbiAgICAgICAgdGhpc1xuICAgICAgKSAtIDE7XG4gICAgfVxuICB9XG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgfVxuICBydW4oZm4pIHtcbiAgICBpZiAodGhpcy5fYWN0aXZlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RWZmZWN0U2NvcGUgPSBhY3RpdmVFZmZlY3RTY29wZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGFjdGl2ZUVmZmVjdFNjb3BlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhY3RpdmVFZmZlY3RTY29wZSA9IGN1cnJlbnRFZmZlY3RTY29wZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIHdhcm4oYGNhbm5vdCBydW4gYW4gaW5hY3RpdmUgZWZmZWN0IHNjb3BlLmApO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogVGhpcyBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gbm9uLWRldGFjaGVkIHNjb3Blc1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG9uKCkge1xuICAgIGFjdGl2ZUVmZmVjdFNjb3BlID0gdGhpcztcbiAgfVxuICAvKipcbiAgICogVGhpcyBzaG91bGQgb25seSBiZSBjYWxsZWQgb24gbm9uLWRldGFjaGVkIHNjb3Blc1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG9mZigpIHtcbiAgICBhY3RpdmVFZmZlY3RTY29wZSA9IHRoaXMucGFyZW50O1xuICB9XG4gIHN0b3AoZnJvbVBhcmVudCkge1xuICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgIGxldCBpLCBsO1xuICAgICAgZm9yIChpID0gMCwgbCA9IHRoaXMuZWZmZWN0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdGhpcy5lZmZlY3RzW2ldLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLmNsZWFudXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLmNsZWFudXBzW2ldKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zY29wZXMpIHtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHRoaXMuc2NvcGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHRoaXMuc2NvcGVzW2ldLnN0b3AodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5kZXRhY2hlZCAmJiB0aGlzLnBhcmVudCAmJiAhZnJvbVBhcmVudCkge1xuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5wYXJlbnQuc2NvcGVzLnBvcCgpO1xuICAgICAgICBpZiAobGFzdCAmJiBsYXN0ICE9PSB0aGlzKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQuc2NvcGVzW3RoaXMuaW5kZXhdID0gbGFzdDtcbiAgICAgICAgICBsYXN0LmluZGV4ID0gdGhpcy5pbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wYXJlbnQgPSB2b2lkIDA7XG4gICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGVmZmVjdFNjb3BlKGRldGFjaGVkKSB7XG4gIHJldHVybiBuZXcgRWZmZWN0U2NvcGUoZGV0YWNoZWQpO1xufVxuZnVuY3Rpb24gcmVjb3JkRWZmZWN0U2NvcGUoZWZmZWN0LCBzY29wZSA9IGFjdGl2ZUVmZmVjdFNjb3BlKSB7XG4gIGlmIChzY29wZSAmJiBzY29wZS5hY3RpdmUpIHtcbiAgICBzY29wZS5lZmZlY3RzLnB1c2goZWZmZWN0KTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0Q3VycmVudFNjb3BlKCkge1xuICByZXR1cm4gYWN0aXZlRWZmZWN0U2NvcGU7XG59XG5mdW5jdGlvbiBvblNjb3BlRGlzcG9zZShmbikge1xuICBpZiAoYWN0aXZlRWZmZWN0U2NvcGUpIHtcbiAgICBhY3RpdmVFZmZlY3RTY29wZS5jbGVhbnVwcy5wdXNoKGZuKTtcbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihcbiAgICAgIGBvblNjb3BlRGlzcG9zZSgpIGlzIGNhbGxlZCB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBlZmZlY3Qgc2NvcGUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoLmBcbiAgICApO1xuICB9XG59XG5cbmNvbnN0IGNyZWF0ZURlcCA9IChlZmZlY3RzKSA9PiB7XG4gIGNvbnN0IGRlcCA9IG5ldyBTZXQoZWZmZWN0cyk7XG4gIGRlcC53ID0gMDtcbiAgZGVwLm4gPSAwO1xuICByZXR1cm4gZGVwO1xufTtcbmNvbnN0IHdhc1RyYWNrZWQgPSAoZGVwKSA9PiAoZGVwLncgJiB0cmFja09wQml0KSA+IDA7XG5jb25zdCBuZXdUcmFja2VkID0gKGRlcCkgPT4gKGRlcC5uICYgdHJhY2tPcEJpdCkgPiAwO1xuY29uc3QgaW5pdERlcE1hcmtlcnMgPSAoeyBkZXBzIH0pID0+IHtcbiAgaWYgKGRlcHMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXBzW2ldLncgfD0gdHJhY2tPcEJpdDtcbiAgICB9XG4gIH1cbn07XG5jb25zdCBmaW5hbGl6ZURlcE1hcmtlcnMgPSAoZWZmZWN0KSA9PiB7XG4gIGNvbnN0IHsgZGVwcyB9ID0gZWZmZWN0O1xuICBpZiAoZGVwcy5sZW5ndGgpIHtcbiAgICBsZXQgcHRyID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGRlcCA9IGRlcHNbaV07XG4gICAgICBpZiAod2FzVHJhY2tlZChkZXApICYmICFuZXdUcmFja2VkKGRlcCkpIHtcbiAgICAgICAgZGVwLmRlbGV0ZShlZmZlY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVwc1twdHIrK10gPSBkZXA7XG4gICAgICB9XG4gICAgICBkZXAudyAmPSB+dHJhY2tPcEJpdDtcbiAgICAgIGRlcC5uICY9IH50cmFja09wQml0O1xuICAgIH1cbiAgICBkZXBzLmxlbmd0aCA9IHB0cjtcbiAgfVxufTtcblxuY29uc3QgdGFyZ2V0TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5sZXQgZWZmZWN0VHJhY2tEZXB0aCA9IDA7XG5sZXQgdHJhY2tPcEJpdCA9IDE7XG5jb25zdCBtYXhNYXJrZXJCaXRzID0gMzA7XG5sZXQgYWN0aXZlRWZmZWN0O1xuY29uc3QgSVRFUkFURV9LRVkgPSBTeW1ib2woISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IFwiaXRlcmF0ZVwiIDogXCJcIik7XG5jb25zdCBNQVBfS0VZX0lURVJBVEVfS0VZID0gU3ltYm9sKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyBcIk1hcCBrZXkgaXRlcmF0ZVwiIDogXCJcIik7XG5jbGFzcyBSZWFjdGl2ZUVmZmVjdCB7XG4gIGNvbnN0cnVjdG9yKGZuLCBzY2hlZHVsZXIgPSBudWxsLCBzY29wZSkge1xuICAgIHRoaXMuZm4gPSBmbjtcbiAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5kZXBzID0gW107XG4gICAgdGhpcy5wYXJlbnQgPSB2b2lkIDA7XG4gICAgcmVjb3JkRWZmZWN0U2NvcGUodGhpcywgc2NvcGUpO1xuICB9XG4gIHJ1bigpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XG4gICAgICByZXR1cm4gdGhpcy5mbigpO1xuICAgIH1cbiAgICBsZXQgcGFyZW50ID0gYWN0aXZlRWZmZWN0O1xuICAgIGxldCBsYXN0U2hvdWxkVHJhY2sgPSBzaG91bGRUcmFjaztcbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50ID09PSB0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnBhcmVudCA9IGFjdGl2ZUVmZmVjdDtcbiAgICAgIGFjdGl2ZUVmZmVjdCA9IHRoaXM7XG4gICAgICBzaG91bGRUcmFjayA9IHRydWU7XG4gICAgICB0cmFja09wQml0ID0gMSA8PCArK2VmZmVjdFRyYWNrRGVwdGg7XG4gICAgICBpZiAoZWZmZWN0VHJhY2tEZXB0aCA8PSBtYXhNYXJrZXJCaXRzKSB7XG4gICAgICAgIGluaXREZXBNYXJrZXJzKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYW51cEVmZmVjdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZuKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlZmZlY3RUcmFja0RlcHRoIDw9IG1heE1hcmtlckJpdHMpIHtcbiAgICAgICAgZmluYWxpemVEZXBNYXJrZXJzKHRoaXMpO1xuICAgICAgfVxuICAgICAgdHJhY2tPcEJpdCA9IDEgPDwgLS1lZmZlY3RUcmFja0RlcHRoO1xuICAgICAgYWN0aXZlRWZmZWN0ID0gdGhpcy5wYXJlbnQ7XG4gICAgICBzaG91bGRUcmFjayA9IGxhc3RTaG91bGRUcmFjaztcbiAgICAgIHRoaXMucGFyZW50ID0gdm9pZCAwO1xuICAgICAgaWYgKHRoaXMuZGVmZXJTdG9wKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBzdG9wKCkge1xuICAgIGlmIChhY3RpdmVFZmZlY3QgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuZGVmZXJTdG9wID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBjbGVhbnVwRWZmZWN0KHRoaXMpO1xuICAgICAgaWYgKHRoaXMub25TdG9wKSB7XG4gICAgICAgIHRoaXMub25TdG9wKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gY2xlYW51cEVmZmVjdChlZmZlY3QyKSB7XG4gIGNvbnN0IHsgZGVwcyB9ID0gZWZmZWN0MjtcbiAgaWYgKGRlcHMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXBzW2ldLmRlbGV0ZShlZmZlY3QyKTtcbiAgICB9XG4gICAgZGVwcy5sZW5ndGggPSAwO1xuICB9XG59XG5mdW5jdGlvbiBlZmZlY3QoZm4sIG9wdGlvbnMpIHtcbiAgaWYgKGZuLmVmZmVjdCkge1xuICAgIGZuID0gZm4uZWZmZWN0LmZuO1xuICB9XG4gIGNvbnN0IF9lZmZlY3QgPSBuZXcgUmVhY3RpdmVFZmZlY3QoZm4pO1xuICBpZiAob3B0aW9ucykge1xuICAgIGV4dGVuZChfZWZmZWN0LCBvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5zY29wZSlcbiAgICAgIHJlY29yZEVmZmVjdFNjb3BlKF9lZmZlY3QsIG9wdGlvbnMuc2NvcGUpO1xuICB9XG4gIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5sYXp5KSB7XG4gICAgX2VmZmVjdC5ydW4oKTtcbiAgfVxuICBjb25zdCBydW5uZXIgPSBfZWZmZWN0LnJ1bi5iaW5kKF9lZmZlY3QpO1xuICBydW5uZXIuZWZmZWN0ID0gX2VmZmVjdDtcbiAgcmV0dXJuIHJ1bm5lcjtcbn1cbmZ1bmN0aW9uIHN0b3AocnVubmVyKSB7XG4gIHJ1bm5lci5lZmZlY3Quc3RvcCgpO1xufVxubGV0IHNob3VsZFRyYWNrID0gdHJ1ZTtcbmNvbnN0IHRyYWNrU3RhY2sgPSBbXTtcbmZ1bmN0aW9uIHBhdXNlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gZmFsc2U7XG59XG5mdW5jdGlvbiBlbmFibGVUcmFja2luZygpIHtcbiAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcbiAgc2hvdWxkVHJhY2sgPSB0cnVlO1xufVxuZnVuY3Rpb24gcmVzZXRUcmFja2luZygpIHtcbiAgY29uc3QgbGFzdCA9IHRyYWNrU3RhY2sucG9wKCk7XG4gIHNob3VsZFRyYWNrID0gbGFzdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IGxhc3Q7XG59XG5mdW5jdGlvbiB0cmFjayh0YXJnZXQsIHR5cGUsIGtleSkge1xuICBpZiAoc2hvdWxkVHJhY2sgJiYgYWN0aXZlRWZmZWN0KSB7XG4gICAgbGV0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XG4gICAgaWYgKCFkZXBzTWFwKSB7XG4gICAgICB0YXJnZXRNYXAuc2V0KHRhcmdldCwgZGVwc01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCkpO1xuICAgIH1cbiAgICBsZXQgZGVwID0gZGVwc01hcC5nZXQoa2V5KTtcbiAgICBpZiAoIWRlcCkge1xuICAgICAgZGVwc01hcC5zZXQoa2V5LCBkZXAgPSBjcmVhdGVEZXAoKSk7XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50SW5mbyA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyB7IGVmZmVjdDogYWN0aXZlRWZmZWN0LCB0YXJnZXQsIHR5cGUsIGtleSB9IDogdm9pZCAwO1xuICAgIHRyYWNrRWZmZWN0cyhkZXAsIGV2ZW50SW5mbyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHRyYWNrRWZmZWN0cyhkZXAsIGRlYnVnZ2VyRXZlbnRFeHRyYUluZm8pIHtcbiAgbGV0IHNob3VsZFRyYWNrMiA9IGZhbHNlO1xuICBpZiAoZWZmZWN0VHJhY2tEZXB0aCA8PSBtYXhNYXJrZXJCaXRzKSB7XG4gICAgaWYgKCFuZXdUcmFja2VkKGRlcCkpIHtcbiAgICAgIGRlcC5uIHw9IHRyYWNrT3BCaXQ7XG4gICAgICBzaG91bGRUcmFjazIgPSAhd2FzVHJhY2tlZChkZXApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzaG91bGRUcmFjazIgPSAhZGVwLmhhcyhhY3RpdmVFZmZlY3QpO1xuICB9XG4gIGlmIChzaG91bGRUcmFjazIpIHtcbiAgICBkZXAuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgYWN0aXZlRWZmZWN0LmRlcHMucHVzaChkZXApO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGFjdGl2ZUVmZmVjdC5vblRyYWNrKSB7XG4gICAgICBhY3RpdmVFZmZlY3Qub25UcmFjayhcbiAgICAgICAgZXh0ZW5kKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVmZmVjdDogYWN0aXZlRWZmZWN0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWJ1Z2dlckV2ZW50RXh0cmFJbmZvXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyKHRhcmdldCwgdHlwZSwga2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUsIG9sZFRhcmdldCkge1xuICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGRlcHMgPSBbXTtcbiAgaWYgKHR5cGUgPT09IFwiY2xlYXJcIikge1xuICAgIGRlcHMgPSBbLi4uZGVwc01hcC52YWx1ZXMoKV07XG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcImxlbmd0aFwiICYmIGlzQXJyYXkodGFyZ2V0KSkge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IE51bWJlcihuZXdWYWx1ZSk7XG4gICAgZGVwc01hcC5mb3JFYWNoKChkZXAsIGtleTIpID0+IHtcbiAgICAgIGlmIChrZXkyID09PSBcImxlbmd0aFwiIHx8IGtleTIgPj0gbmV3TGVuZ3RoKSB7XG4gICAgICAgIGRlcHMucHVzaChkZXApO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGlmIChrZXkgIT09IHZvaWQgMCkge1xuICAgICAgZGVwcy5wdXNoKGRlcHNNYXAuZ2V0KGtleSkpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICBkZXBzLnB1c2goZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgZGVwcy5wdXNoKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaXNJbnRlZ2VyS2V5KGtleSkpIHtcbiAgICAgICAgICBkZXBzLnB1c2goZGVwc01hcC5nZXQoXCJsZW5ndGhcIikpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGRlcHMucHVzaChkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBkZXBzLnB1c2goZGVwc01hcC5nZXQoTUFQX0tFWV9JVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzZXRcIjpcbiAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICBkZXBzLnB1c2goZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgY29uc3QgZXZlbnRJbmZvID0gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHsgdGFyZ2V0LCB0eXBlLCBrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSwgb2xkVGFyZ2V0IH0gOiB2b2lkIDA7XG4gIGlmIChkZXBzLmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChkZXBzWzBdKSB7XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICB0cmlnZ2VyRWZmZWN0cyhkZXBzWzBdLCBldmVudEluZm8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJpZ2dlckVmZmVjdHMoZGVwc1swXSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGVmZmVjdHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGRlcCBvZiBkZXBzKSB7XG4gICAgICBpZiAoZGVwKSB7XG4gICAgICAgIGVmZmVjdHMucHVzaCguLi5kZXApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgdHJpZ2dlckVmZmVjdHMoY3JlYXRlRGVwKGVmZmVjdHMpLCBldmVudEluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlnZ2VyRWZmZWN0cyhjcmVhdGVEZXAoZWZmZWN0cykpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gdHJpZ2dlckVmZmVjdHMoZGVwLCBkZWJ1Z2dlckV2ZW50RXh0cmFJbmZvKSB7XG4gIGNvbnN0IGVmZmVjdHMgPSBpc0FycmF5KGRlcCkgPyBkZXAgOiBbLi4uZGVwXTtcbiAgZm9yIChjb25zdCBlZmZlY3QyIG9mIGVmZmVjdHMpIHtcbiAgICBpZiAoZWZmZWN0Mi5jb21wdXRlZCkge1xuICAgICAgdHJpZ2dlckVmZmVjdChlZmZlY3QyLCBkZWJ1Z2dlckV2ZW50RXh0cmFJbmZvKTtcbiAgICB9XG4gIH1cbiAgZm9yIChjb25zdCBlZmZlY3QyIG9mIGVmZmVjdHMpIHtcbiAgICBpZiAoIWVmZmVjdDIuY29tcHV0ZWQpIHtcbiAgICAgIHRyaWdnZXJFZmZlY3QoZWZmZWN0MiwgZGVidWdnZXJFdmVudEV4dHJhSW5mbyk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyRWZmZWN0KGVmZmVjdDIsIGRlYnVnZ2VyRXZlbnRFeHRyYUluZm8pIHtcbiAgaWYgKGVmZmVjdDIgIT09IGFjdGl2ZUVmZmVjdCB8fCBlZmZlY3QyLmFsbG93UmVjdXJzZSkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGVmZmVjdDIub25UcmlnZ2VyKSB7XG4gICAgICBlZmZlY3QyLm9uVHJpZ2dlcihleHRlbmQoeyBlZmZlY3Q6IGVmZmVjdDIgfSwgZGVidWdnZXJFdmVudEV4dHJhSW5mbykpO1xuICAgIH1cbiAgICBpZiAoZWZmZWN0Mi5zY2hlZHVsZXIpIHtcbiAgICAgIGVmZmVjdDIuc2NoZWR1bGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVmZmVjdDIucnVuKCk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBnZXREZXBGcm9tUmVhY3RpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIF9hO1xuICByZXR1cm4gKF9hID0gdGFyZ2V0TWFwLmdldChvYmplY3QpKSA9PSBudWxsID8gdm9pZCAwIDogX2EuZ2V0KGtleSk7XG59XG5cbmNvbnN0IGlzTm9uVHJhY2thYmxlS2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKGBfX3Byb3RvX18sX192X2lzUmVmLF9faXNWdWVgKTtcbmNvbnN0IGJ1aWx0SW5TeW1ib2xzID0gbmV3IFNldChcbiAgLyogQF9fUFVSRV9fICovIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKFN5bWJvbCkuZmlsdGVyKChrZXkpID0+IGtleSAhPT0gXCJhcmd1bWVudHNcIiAmJiBrZXkgIT09IFwiY2FsbGVyXCIpLm1hcCgoa2V5KSA9PiBTeW1ib2xba2V5XSkuZmlsdGVyKGlzU3ltYm9sKVxuKTtcbmNvbnN0IGdldCQxID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcigpO1xuY29uc3Qgc2hhbGxvd0dldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIoZmFsc2UsIHRydWUpO1xuY29uc3QgcmVhZG9ubHlHZXQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKHRydWUpO1xuY29uc3Qgc2hhbGxvd1JlYWRvbmx5R2V0ID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcih0cnVlLCB0cnVlKTtcbmNvbnN0IGFycmF5SW5zdHJ1bWVudGF0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVBcnJheUluc3RydW1lbnRhdGlvbnMoKTtcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5SW5zdHJ1bWVudGF0aW9ucygpIHtcbiAgY29uc3QgaW5zdHJ1bWVudGF0aW9ucyA9IHt9O1xuICBbXCJpbmNsdWRlc1wiLCBcImluZGV4T2ZcIiwgXCJsYXN0SW5kZXhPZlwiXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpbnN0cnVtZW50YXRpb25zW2tleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICBjb25zdCBhcnIgPSB0b1Jhdyh0aGlzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdHJhY2soYXJyLCBcImdldFwiLCBpICsgXCJcIik7XG4gICAgICB9XG4gICAgICBjb25zdCByZXMgPSBhcnJba2V5XSguLi5hcmdzKTtcbiAgICAgIGlmIChyZXMgPT09IC0xIHx8IHJlcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGFycltrZXldKC4uLmFyZ3MubWFwKHRvUmF3KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuICBbXCJwdXNoXCIsIFwicG9wXCIsIFwic2hpZnRcIiwgXCJ1bnNoaWZ0XCIsIFwic3BsaWNlXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIHBhdXNlVHJhY2tpbmcoKTtcbiAgICAgIGNvbnN0IHJlcyA9IHRvUmF3KHRoaXMpW2tleV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICByZXNldFRyYWNraW5nKCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gIH0pO1xuICByZXR1cm4gaW5zdHJ1bWVudGF0aW9ucztcbn1cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KGtleSkge1xuICBjb25zdCBvYmogPSB0b1Jhdyh0aGlzKTtcbiAgdHJhY2sob2JqLCBcImhhc1wiLCBrZXkpO1xuICByZXR1cm4gb2JqLmhhc093blByb3BlcnR5KGtleSk7XG59XG5mdW5jdGlvbiBjcmVhdGVHZXR0ZXIoaXNSZWFkb25seTIgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXQyKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5MjtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTI7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X2lzU2hhbGxvd1wiKSB7XG4gICAgICByZXR1cm4gc2hhbGxvdztcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIgJiYgcmVjZWl2ZXIgPT09IChpc1JlYWRvbmx5MiA/IHNoYWxsb3cgPyBzaGFsbG93UmVhZG9ubHlNYXAgOiByZWFkb25seU1hcCA6IHNoYWxsb3cgPyBzaGFsbG93UmVhY3RpdmVNYXAgOiByZWFjdGl2ZU1hcCkuZ2V0KHRhcmdldCkpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IHRhcmdldElzQXJyYXkgPSBpc0FycmF5KHRhcmdldCk7XG4gICAgaWYgKCFpc1JlYWRvbmx5Mikge1xuICAgICAgaWYgKHRhcmdldElzQXJyYXkgJiYgaGFzT3duKGFycmF5SW5zdHJ1bWVudGF0aW9ucywga2V5KSkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQoYXJyYXlJbnN0cnVtZW50YXRpb25zLCBrZXksIHJlY2VpdmVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09IFwiaGFzT3duUHJvcGVydHlcIikge1xuICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gICAgaWYgKGlzU3ltYm9sKGtleSkgPyBidWlsdEluU3ltYm9scy5oYXMoa2V5KSA6IGlzTm9uVHJhY2thYmxlS2V5cyhrZXkpKSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoIWlzUmVhZG9ubHkyKSB7XG4gICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIGlmIChzaGFsbG93KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoaXNSZWYocmVzKSkge1xuICAgICAgcmV0dXJuIHRhcmdldElzQXJyYXkgJiYgaXNJbnRlZ2VyS2V5KGtleSkgPyByZXMgOiByZXMudmFsdWU7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChyZXMpKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTIgPyByZWFkb25seShyZXMpIDogcmVhY3RpdmUocmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn1cbmNvbnN0IHNldCQxID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZVNldHRlcigpO1xuY29uc3Qgc2hhbGxvd1NldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVTZXR0ZXIodHJ1ZSk7XG5mdW5jdGlvbiBjcmVhdGVTZXR0ZXIoc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZXQyKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBsZXQgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBpZiAoaXNSZWFkb25seShvbGRWYWx1ZSkgJiYgaXNSZWYob2xkVmFsdWUpICYmICFpc1JlZih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFzaGFsbG93KSB7XG4gICAgICBpZiAoIWlzU2hhbGxvdyh2YWx1ZSkgJiYgIWlzUmVhZG9ubHkodmFsdWUpKSB7XG4gICAgICAgIG9sZFZhbHVlID0gdG9SYXcob2xkVmFsdWUpO1xuICAgICAgICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpICYmIGlzUmVmKG9sZFZhbHVlKSAmJiAhaXNSZWYodmFsdWUpKSB7XG4gICAgICAgIG9sZFZhbHVlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBoYWRLZXkgPSBpc0FycmF5KHRhcmdldCkgJiYgaXNJbnRlZ2VyS2V5KGtleSkgPyBOdW1iZXIoa2V5KSA8IHRhcmdldC5sZW5ndGggOiBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgIGlmICh0YXJnZXQgPT09IHRvUmF3KHJlY2VpdmVyKSkge1xuICAgICAgaWYgKCFoYWRLZXkpIHtcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChoYXNDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSkpIHtcbiAgICAgICAgdHJpZ2dlcih0YXJnZXQsIFwic2V0XCIsIGtleSwgdmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IGhhZEtleSA9IGhhc093bih0YXJnZXQsIGtleSk7XG4gIGNvbnN0IG9sZFZhbHVlID0gdGFyZ2V0W2tleV07XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBrZXkpO1xuICBpZiAocmVzdWx0ICYmIGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBoYXMkMSh0YXJnZXQsIGtleSkge1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0Lmhhcyh0YXJnZXQsIGtleSk7XG4gIGlmICghaXNTeW1ib2woa2V5KSB8fCAhYnVpbHRJblN5bWJvbHMuaGFzKGtleSkpIHtcbiAgICB0cmFjayh0YXJnZXQsIFwiaGFzXCIsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG93bktleXModGFyZ2V0KSB7XG4gIHRyYWNrKHRhcmdldCwgXCJpdGVyYXRlXCIsIGlzQXJyYXkodGFyZ2V0KSA/IFwibGVuZ3RoXCIgOiBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbn1cbmNvbnN0IG11dGFibGVIYW5kbGVycyA9IHtcbiAgZ2V0OiBnZXQkMSxcbiAgc2V0OiBzZXQkMSxcbiAgZGVsZXRlUHJvcGVydHksXG4gIGhhczogaGFzJDEsXG4gIG93bktleXNcbn07XG5jb25zdCByZWFkb25seUhhbmRsZXJzID0ge1xuICBnZXQ6IHJlYWRvbmx5R2V0LFxuICBzZXQodGFyZ2V0LCBrZXkpIHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgd2FybihcbiAgICAgICAgYFNldCBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLFxuICAgICAgICB0YXJnZXRcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgRGVsZXRlIG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsXG4gICAgICAgIHRhcmdldFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5jb25zdCBzaGFsbG93UmVhY3RpdmVIYW5kbGVycyA9IC8qIEBfX1BVUkVfXyAqLyBleHRlbmQoXG4gIHt9LFxuICBtdXRhYmxlSGFuZGxlcnMsXG4gIHtcbiAgICBnZXQ6IHNoYWxsb3dHZXQsXG4gICAgc2V0OiBzaGFsbG93U2V0XG4gIH1cbik7XG5jb25zdCBzaGFsbG93UmVhZG9ubHlIYW5kbGVycyA9IC8qIEBfX1BVUkVfXyAqLyBleHRlbmQoXG4gIHt9LFxuICByZWFkb25seUhhbmRsZXJzLFxuICB7XG4gICAgZ2V0OiBzaGFsbG93UmVhZG9ubHlHZXRcbiAgfVxuKTtcblxuY29uc3QgdG9TaGFsbG93ID0gKHZhbHVlKSA9PiB2YWx1ZTtcbmNvbnN0IGdldFByb3RvID0gKHYpID0+IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2Yodik7XG5mdW5jdGlvbiBnZXQodGFyZ2V0LCBrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSwgaXNTaGFsbG93ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1wiX192X3Jhd1wiXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKCFpc1JlYWRvbmx5KSB7XG4gICAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgICB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwgcmF3S2V5KTtcbiAgfVxuICBjb25zdCB7IGhhczogaGFzMiB9ID0gZ2V0UHJvdG8ocmF3VGFyZ2V0KTtcbiAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIGtleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KGtleSkpO1xuICB9IGVsc2UgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIHJhd0tleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KHJhd0tleSkpO1xuICB9IGVsc2UgaWYgKHRhcmdldCAhPT0gcmF3VGFyZ2V0KSB7XG4gICAgdGFyZ2V0LmdldChrZXkpO1xuICB9XG59XG5mdW5jdGlvbiBoYXMoa2V5LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcIl9fdl9yYXdcIl07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmICghaXNSZWFkb25seSkge1xuICAgIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICAgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICAgIH1cbiAgICB0cmFjayhyYXdUYXJnZXQsIFwiaGFzXCIsIHJhd0tleSk7XG4gIH1cbiAgcmV0dXJuIGtleSA9PT0gcmF3S2V5ID8gdGFyZ2V0LmhhcyhrZXkpIDogdGFyZ2V0LmhhcyhrZXkpIHx8IHRhcmdldC5oYXMocmF3S2V5KTtcbn1cbmZ1bmN0aW9uIHNpemUodGFyZ2V0LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1wiX192X3Jhd1wiXTtcbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2sodG9SYXcodGFyZ2V0KSwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgXCJzaXplXCIsIHRhcmdldCk7XG59XG5mdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCBwcm90byA9IGdldFByb3RvKHRhcmdldCk7XG4gIGNvbnN0IGhhZEtleSA9IHByb3RvLmhhcy5jYWxsKHRhcmdldCwgdmFsdWUpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIHRhcmdldC5hZGQodmFsdWUpO1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCB2YWx1ZSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7IGhhczogaGFzMiwgZ2V0OiBnZXQyIH0gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIHRhcmdldC5zZXQoa2V5LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyLCBnZXQ6IGdldDIgfSA9IGdldFByb3RvKHRhcmdldCk7XG4gIGxldCBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIGtleSA9IHRvUmF3KGtleSk7XG4gICAgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpO1xuICB9XG4gIGNvbnN0IG9sZFZhbHVlID0gZ2V0MiA/IGdldDIuY2FsbCh0YXJnZXQsIGtleSkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5kZWxldGUoa2V5KTtcbiAgaWYgKGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IGhhZEl0ZW1zID0gdGFyZ2V0LnNpemUgIT09IDA7XG4gIGNvbnN0IG9sZFRhcmdldCA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyBpc01hcCh0YXJnZXQpID8gbmV3IE1hcCh0YXJnZXQpIDogbmV3IFNldCh0YXJnZXQpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuY2xlYXIoKTtcbiAgaWYgKGhhZEl0ZW1zKSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiY2xlYXJcIiwgdm9pZCAwLCB2b2lkIDAsIG9sZFRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZWQgPSB0aGlzO1xuICAgIGNvbnN0IHRhcmdldCA9IG9ic2VydmVkW1wiX192X3Jhd1wiXTtcbiAgICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICAgIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcIml0ZXJhdGVcIiwgSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB0YXJnZXQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgd3JhcCh2YWx1ZSksIHdyYXAoa2V5KSwgb2JzZXJ2ZWQpO1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCBpc1JlYWRvbmx5LCBpc1NoYWxsb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzW1wiX192X3Jhd1wiXTtcbiAgICBjb25zdCByYXdUYXJnZXQgPSB0b1Jhdyh0YXJnZXQpO1xuICAgIGNvbnN0IHRhcmdldElzTWFwID0gaXNNYXAocmF3VGFyZ2V0KTtcbiAgICBjb25zdCBpc1BhaXIgPSBtZXRob2QgPT09IFwiZW50cmllc1wiIHx8IG1ldGhvZCA9PT0gU3ltYm9sLml0ZXJhdG9yICYmIHRhcmdldElzTWFwO1xuICAgIGNvbnN0IGlzS2V5T25seSA9IG1ldGhvZCA9PT0gXCJrZXlzXCIgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaW5uZXJJdGVyYXRvciA9IHRhcmdldFttZXRob2RdKC4uLmFyZ3MpO1xuICAgIGNvbnN0IHdyYXAgPSBpc1NoYWxsb3cgPyB0b1NoYWxsb3cgOiBpc1JlYWRvbmx5ID8gdG9SZWFkb25seSA6IHRvUmVhY3RpdmU7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2soXG4gICAgICByYXdUYXJnZXQsXG4gICAgICBcIml0ZXJhdGVcIixcbiAgICAgIGlzS2V5T25seSA/IE1BUF9LRVlfSVRFUkFURV9LRVkgOiBJVEVSQVRFX0tFWVxuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIGl0ZXJhdG9yIHByb3RvY29sXG4gICAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSBpbm5lckl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIGRvbmUgPyB7IHZhbHVlLCBkb25lIH0gOiB7XG4gICAgICAgICAgdmFsdWU6IGlzUGFpciA/IFt3cmFwKHZhbHVlWzBdKSwgd3JhcCh2YWx1ZVsxXSldIDogd3JhcCh2YWx1ZSksXG4gICAgICAgICAgZG9uZVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIC8vIGl0ZXJhYmxlIHByb3RvY29sXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlYWRvbmx5TWV0aG9kKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgY29uc3Qga2V5ID0gYXJnc1swXSA/IGBvbiBrZXkgXCIke2FyZ3NbMF19XCIgYCA6IGBgO1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCxcbiAgICAgICAgdG9SYXcodGhpcylcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlID09PSBcImRlbGV0ZVwiID8gZmFsc2UgOiB0aGlzO1xuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudGF0aW9ucygpIHtcbiAgY29uc3QgbXV0YWJsZUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQodGhpcywga2V5KTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXMsXG4gICAgYWRkLFxuICAgIHNldCxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIGZhbHNlKVxuICB9O1xuICBjb25zdCBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCBrZXksIGZhbHNlLCB0cnVlKTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXMsXG4gICAgYWRkLFxuICAgIHNldCxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIHRydWUpXG4gIH07XG4gIGNvbnN0IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgYWRkOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImFkZFwiKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwic2V0XCIpLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJkZWxldGVcIiksXG4gICAgY2xlYXI6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiY2xlYXJcIiksXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCBmYWxzZSlcbiAgfTtcbiAgY29uc3Qgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCh0aGlzLCBrZXksIHRydWUsIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICAgIH0sXG4gICAgYWRkOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImFkZFwiKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwic2V0XCIpLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJkZWxldGVcIiksXG4gICAgY2xlYXI6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiY2xlYXJcIiksXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCB0cnVlKVxuICB9O1xuICBjb25zdCBpdGVyYXRvck1ldGhvZHMgPSBbXCJrZXlzXCIsIFwidmFsdWVzXCIsIFwiZW50cmllc1wiLCBTeW1ib2wuaXRlcmF0b3JdO1xuICBpdGVyYXRvck1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgbXV0YWJsZUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChcbiAgICAgIG1ldGhvZCxcbiAgICAgIGZhbHNlLFxuICAgICAgZmFsc2VcbiAgICApO1xuICAgIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKFxuICAgICAgbWV0aG9kLFxuICAgICAgdHJ1ZSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKFxuICAgICAgbWV0aG9kLFxuICAgICAgZmFsc2UsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMlttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QoXG4gICAgICBtZXRob2QsXG4gICAgICB0cnVlLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gIH0pO1xuICByZXR1cm4gW1xuICAgIG11dGFibGVJbnN0cnVtZW50YXRpb25zMixcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnMyLFxuICAgIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMixcbiAgICBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMlxuICBdO1xufVxuY29uc3QgW1xuICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucyxcbiAgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zLFxuICBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucyxcbiAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uc1xuXSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25zKCk7XG5mdW5jdGlvbiBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIoaXNSZWFkb25seSwgc2hhbGxvdykge1xuICBjb25zdCBpbnN0cnVtZW50YXRpb25zID0gc2hhbGxvdyA/IGlzUmVhZG9ubHkgPyBzaGFsbG93UmVhZG9ubHlJbnN0cnVtZW50YXRpb25zIDogc2hhbGxvd0luc3RydW1lbnRhdGlvbnMgOiBpc1JlYWRvbmx5ID8gcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zIDogbXV0YWJsZUluc3RydW1lbnRhdGlvbnM7XG4gIHJldHVybiAodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSA9PiB7XG4gICAgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFjdGl2ZVwiKSB7XG4gICAgICByZXR1cm4gIWlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X2lzUmVhZG9ubHlcIikge1xuICAgICAgcmV0dXJuIGlzUmVhZG9ubHk7XG4gICAgfSBlbHNlIGlmIChrZXkgPT09IFwiX192X3Jhd1wiKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoXG4gICAgICBoYXNPd24oaW5zdHJ1bWVudGF0aW9ucywga2V5KSAmJiBrZXkgaW4gdGFyZ2V0ID8gaW5zdHJ1bWVudGF0aW9ucyA6IHRhcmdldCxcbiAgICAgIGtleSxcbiAgICAgIHJlY2VpdmVyXG4gICAgKTtcbiAgfTtcbn1cbmNvbnN0IG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihmYWxzZSwgZmFsc2UpXG59O1xuY29uc3Qgc2hhbGxvd0NvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCB0cnVlKVxufTtcbmNvbnN0IHJlYWRvbmx5Q29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIodHJ1ZSwgZmFsc2UpXG59O1xuY29uc3Qgc2hhbGxvd1JlYWRvbmx5Q29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIodHJ1ZSwgdHJ1ZSlcbn07XG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSkge1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAocmF3S2V5ICE9PSBrZXkgJiYgaGFzMi5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xuICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcbiAgICBjb25zb2xlLndhcm4oXG4gICAgICBgUmVhY3RpdmUgJHt0eXBlfSBjb250YWlucyBib3RoIHRoZSByYXcgYW5kIHJlYWN0aXZlIHZlcnNpb25zIG9mIHRoZSBzYW1lIG9iamVjdCR7dHlwZSA9PT0gYE1hcGAgPyBgIGFzIGtleXNgIDogYGB9LCB3aGljaCBjYW4gbGVhZCB0byBpbmNvbnNpc3RlbmNpZXMuIEF2b2lkIGRpZmZlcmVudGlhdGluZyBiZXR3ZWVuIHRoZSByYXcgYW5kIHJlYWN0aXZlIHZlcnNpb25zIG9mIGFuIG9iamVjdCBhbmQgb25seSB1c2UgdGhlIHJlYWN0aXZlIHZlcnNpb24gaWYgcG9zc2libGUuYFxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgcmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHNoYWxsb3dSZWFjdGl2ZU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmVhZG9ubHlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHNoYWxsb3dSZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gdGFyZ2V0VHlwZU1hcChyYXdUeXBlKSB7XG4gIHN3aXRjaCAocmF3VHlwZSkge1xuICAgIGNhc2UgXCJPYmplY3RcIjpcbiAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgIHJldHVybiAxIC8qIENPTU1PTiAqLztcbiAgICBjYXNlIFwiTWFwXCI6XG4gICAgY2FzZSBcIlNldFwiOlxuICAgIGNhc2UgXCJXZWFrTWFwXCI6XG4gICAgY2FzZSBcIldlYWtTZXRcIjpcbiAgICAgIHJldHVybiAyIC8qIENPTExFQ1RJT04gKi87XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAwIC8qIElOVkFMSUQgKi87XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFRhcmdldFR5cGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlW1wiX192X3NraXBcIl0gfHwgIU9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpID8gMCAvKiBJTlZBTElEICovIDogdGFyZ2V0VHlwZU1hcCh0b1Jhd1R5cGUodmFsdWUpKTtcbn1cbmZ1bmN0aW9uIHJlYWN0aXZlKHRhcmdldCkge1xuICBpZiAoaXNSZWFkb25seSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QoXG4gICAgdGFyZ2V0LFxuICAgIGZhbHNlLFxuICAgIG11dGFibGVIYW5kbGVycyxcbiAgICBtdXRhYmxlQ29sbGVjdGlvbkhhbmRsZXJzLFxuICAgIHJlYWN0aXZlTWFwXG4gICk7XG59XG5mdW5jdGlvbiBzaGFsbG93UmVhY3RpdmUodGFyZ2V0KSB7XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdChcbiAgICB0YXJnZXQsXG4gICAgZmFsc2UsXG4gICAgc2hhbGxvd1JlYWN0aXZlSGFuZGxlcnMsXG4gICAgc2hhbGxvd0NvbGxlY3Rpb25IYW5kbGVycyxcbiAgICBzaGFsbG93UmVhY3RpdmVNYXBcbiAgKTtcbn1cbmZ1bmN0aW9uIHJlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QoXG4gICAgdGFyZ2V0LFxuICAgIHRydWUsXG4gICAgcmVhZG9ubHlIYW5kbGVycyxcbiAgICByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyxcbiAgICByZWFkb25seU1hcFxuICApO1xufVxuZnVuY3Rpb24gc2hhbGxvd1JlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QoXG4gICAgdGFyZ2V0LFxuICAgIHRydWUsXG4gICAgc2hhbGxvd1JlYWRvbmx5SGFuZGxlcnMsXG4gICAgc2hhbGxvd1JlYWRvbmx5Q29sbGVjdGlvbkhhbmRsZXJzLFxuICAgIHNoYWxsb3dSZWFkb25seU1hcFxuICApO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBpc1JlYWRvbmx5MiwgYmFzZUhhbmRsZXJzLCBjb2xsZWN0aW9uSGFuZGxlcnMsIHByb3h5TWFwKSB7XG4gIGlmICghaXNPYmplY3QodGFyZ2V0KSkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYHZhbHVlIGNhbm5vdCBiZSBtYWRlIHJlYWN0aXZlOiAke1N0cmluZyh0YXJnZXQpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGlmICh0YXJnZXRbXCJfX3ZfcmF3XCJdICYmICEoaXNSZWFkb25seTIgJiYgdGFyZ2V0W1wiX192X2lzUmVhY3RpdmVcIl0pKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBjb25zdCBleGlzdGluZ1Byb3h5ID0gcHJveHlNYXAuZ2V0KHRhcmdldCk7XG4gIGlmIChleGlzdGluZ1Byb3h5KSB7XG4gICAgcmV0dXJuIGV4aXN0aW5nUHJveHk7XG4gIH1cbiAgY29uc3QgdGFyZ2V0VHlwZSA9IGdldFRhcmdldFR5cGUodGFyZ2V0KTtcbiAgaWYgKHRhcmdldFR5cGUgPT09IDAgLyogSU5WQUxJRCAqLykge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkoXG4gICAgdGFyZ2V0LFxuICAgIHRhcmdldFR5cGUgPT09IDIgLyogQ09MTEVDVElPTiAqLyA/IGNvbGxlY3Rpb25IYW5kbGVycyA6IGJhc2VIYW5kbGVyc1xuICApO1xuICBwcm94eU1hcC5zZXQodGFyZ2V0LCBwcm94eSk7XG4gIHJldHVybiBwcm94eTtcbn1cbmZ1bmN0aW9uIGlzUmVhY3RpdmUodmFsdWUpIHtcbiAgaWYgKGlzUmVhZG9ubHkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGlzUmVhY3RpdmUodmFsdWVbXCJfX3ZfcmF3XCJdKTtcbiAgfVxuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbXCJfX3ZfaXNSZWFjdGl2ZVwiXSk7XG59XG5mdW5jdGlvbiBpc1JlYWRvbmx5KHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZVtcIl9fdl9pc1JlYWRvbmx5XCJdKTtcbn1cbmZ1bmN0aW9uIGlzU2hhbGxvdyh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbXCJfX3ZfaXNTaGFsbG93XCJdKTtcbn1cbmZ1bmN0aW9uIGlzUHJveHkodmFsdWUpIHtcbiAgcmV0dXJuIGlzUmVhY3RpdmUodmFsdWUpIHx8IGlzUmVhZG9ubHkodmFsdWUpO1xufVxuZnVuY3Rpb24gdG9SYXcob2JzZXJ2ZWQpIHtcbiAgY29uc3QgcmF3ID0gb2JzZXJ2ZWQgJiYgb2JzZXJ2ZWRbXCJfX3ZfcmF3XCJdO1xuICByZXR1cm4gcmF3ID8gdG9SYXcocmF3KSA6IG9ic2VydmVkO1xufVxuZnVuY3Rpb24gbWFya1Jhdyh2YWx1ZSkge1xuICBkZWYodmFsdWUsIFwiX192X3NraXBcIiwgdHJ1ZSk7XG4gIHJldHVybiB2YWx1ZTtcbn1cbmNvbnN0IHRvUmVhY3RpdmUgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWN0aXZlKHZhbHVlKSA6IHZhbHVlO1xuY29uc3QgdG9SZWFkb25seSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhZG9ubHkodmFsdWUpIDogdmFsdWU7XG5cbmZ1bmN0aW9uIHRyYWNrUmVmVmFsdWUocmVmMikge1xuICBpZiAoc2hvdWxkVHJhY2sgJiYgYWN0aXZlRWZmZWN0KSB7XG4gICAgcmVmMiA9IHRvUmF3KHJlZjIpO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICB0cmFja0VmZmVjdHMocmVmMi5kZXAgfHwgKHJlZjIuZGVwID0gY3JlYXRlRGVwKCkpLCB7XG4gICAgICAgIHRhcmdldDogcmVmMixcbiAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAga2V5OiBcInZhbHVlXCJcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja0VmZmVjdHMocmVmMi5kZXAgfHwgKHJlZjIuZGVwID0gY3JlYXRlRGVwKCkpKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHRyaWdnZXJSZWZWYWx1ZShyZWYyLCBuZXdWYWwpIHtcbiAgcmVmMiA9IHRvUmF3KHJlZjIpO1xuICBjb25zdCBkZXAgPSByZWYyLmRlcDtcbiAgaWYgKGRlcCkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICB0cmlnZ2VyRWZmZWN0cyhkZXAsIHtcbiAgICAgICAgdGFyZ2V0OiByZWYyLFxuICAgICAgICB0eXBlOiBcInNldFwiLFxuICAgICAgICBrZXk6IFwidmFsdWVcIixcbiAgICAgICAgbmV3VmFsdWU6IG5ld1ZhbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyaWdnZXJFZmZlY3RzKGRlcCk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBpc1JlZihyKSB7XG4gIHJldHVybiAhIShyICYmIHIuX192X2lzUmVmID09PSB0cnVlKTtcbn1cbmZ1bmN0aW9uIHJlZih2YWx1ZSkge1xuICByZXR1cm4gY3JlYXRlUmVmKHZhbHVlLCBmYWxzZSk7XG59XG5mdW5jdGlvbiBzaGFsbG93UmVmKHZhbHVlKSB7XG4gIHJldHVybiBjcmVhdGVSZWYodmFsdWUsIHRydWUpO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVmKHJhd1ZhbHVlLCBzaGFsbG93KSB7XG4gIGlmIChpc1JlZihyYXdWYWx1ZSkpIHtcbiAgICByZXR1cm4gcmF3VmFsdWU7XG4gIH1cbiAgcmV0dXJuIG5ldyBSZWZJbXBsKHJhd1ZhbHVlLCBzaGFsbG93KTtcbn1cbmNsYXNzIFJlZkltcGwge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSwgX192X2lzU2hhbGxvdykge1xuICAgIHRoaXMuX192X2lzU2hhbGxvdyA9IF9fdl9pc1NoYWxsb3c7XG4gICAgdGhpcy5kZXAgPSB2b2lkIDA7XG4gICAgdGhpcy5fX3ZfaXNSZWYgPSB0cnVlO1xuICAgIHRoaXMuX3Jhd1ZhbHVlID0gX192X2lzU2hhbGxvdyA/IHZhbHVlIDogdG9SYXcodmFsdWUpO1xuICAgIHRoaXMuX3ZhbHVlID0gX192X2lzU2hhbGxvdyA/IHZhbHVlIDogdG9SZWFjdGl2ZSh2YWx1ZSk7XG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHRyYWNrUmVmVmFsdWUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWwpIHtcbiAgICBjb25zdCB1c2VEaXJlY3RWYWx1ZSA9IHRoaXMuX192X2lzU2hhbGxvdyB8fCBpc1NoYWxsb3cobmV3VmFsKSB8fCBpc1JlYWRvbmx5KG5ld1ZhbCk7XG4gICAgbmV3VmFsID0gdXNlRGlyZWN0VmFsdWUgPyBuZXdWYWwgOiB0b1JhdyhuZXdWYWwpO1xuICAgIGlmIChoYXNDaGFuZ2VkKG5ld1ZhbCwgdGhpcy5fcmF3VmFsdWUpKSB7XG4gICAgICB0aGlzLl9yYXdWYWx1ZSA9IG5ld1ZhbDtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdXNlRGlyZWN0VmFsdWUgPyBuZXdWYWwgOiB0b1JlYWN0aXZlKG5ld1ZhbCk7XG4gICAgICB0cmlnZ2VyUmVmVmFsdWUodGhpcywgbmV3VmFsKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHRyaWdnZXJSZWYocmVmMikge1xuICB0cmlnZ2VyUmVmVmFsdWUocmVmMiwgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHJlZjIudmFsdWUgOiB2b2lkIDApO1xufVxuZnVuY3Rpb24gdW5yZWYocmVmMikge1xuICByZXR1cm4gaXNSZWYocmVmMikgPyByZWYyLnZhbHVlIDogcmVmMjtcbn1cbmZ1bmN0aW9uIHRvVmFsdWUoc291cmNlKSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKHNvdXJjZSkgPyBzb3VyY2UoKSA6IHVucmVmKHNvdXJjZSk7XG59XG5jb25zdCBzaGFsbG93VW53cmFwSGFuZGxlcnMgPSB7XG4gIGdldDogKHRhcmdldCwga2V5LCByZWNlaXZlcikgPT4gdW5yZWYoUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSksXG4gIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpID0+IHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgIGlmIChpc1JlZihvbGRWYWx1ZSkgJiYgIWlzUmVmKHZhbHVlKSkge1xuICAgICAgb2xkVmFsdWUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlLCByZWNlaXZlcik7XG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gcHJveHlSZWZzKG9iamVjdFdpdGhSZWZzKSB7XG4gIHJldHVybiBpc1JlYWN0aXZlKG9iamVjdFdpdGhSZWZzKSA/IG9iamVjdFdpdGhSZWZzIDogbmV3IFByb3h5KG9iamVjdFdpdGhSZWZzLCBzaGFsbG93VW53cmFwSGFuZGxlcnMpO1xufVxuY2xhc3MgQ3VzdG9tUmVmSW1wbCB7XG4gIGNvbnN0cnVjdG9yKGZhY3RvcnkpIHtcbiAgICB0aGlzLmRlcCA9IHZvaWQgMDtcbiAgICB0aGlzLl9fdl9pc1JlZiA9IHRydWU7XG4gICAgY29uc3QgeyBnZXQsIHNldCB9ID0gZmFjdG9yeShcbiAgICAgICgpID0+IHRyYWNrUmVmVmFsdWUodGhpcyksXG4gICAgICAoKSA9PiB0cmlnZ2VyUmVmVmFsdWUodGhpcylcbiAgICApO1xuICAgIHRoaXMuX2dldCA9IGdldDtcbiAgICB0aGlzLl9zZXQgPSBzZXQ7XG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXQoKTtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsKSB7XG4gICAgdGhpcy5fc2V0KG5ld1ZhbCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGN1c3RvbVJlZihmYWN0b3J5KSB7XG4gIHJldHVybiBuZXcgQ3VzdG9tUmVmSW1wbChmYWN0b3J5KTtcbn1cbmZ1bmN0aW9uIHRvUmVmcyhvYmplY3QpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWlzUHJveHkob2JqZWN0KSkge1xuICAgIGNvbnNvbGUud2FybihgdG9SZWZzKCkgZXhwZWN0cyBhIHJlYWN0aXZlIG9iamVjdCBidXQgcmVjZWl2ZWQgYSBwbGFpbiBvbmUuYCk7XG4gIH1cbiAgY29uc3QgcmV0ID0gaXNBcnJheShvYmplY3QpID8gbmV3IEFycmF5KG9iamVjdC5sZW5ndGgpIDoge307XG4gIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xuICAgIHJldFtrZXldID0gcHJvcGVydHlUb1JlZihvYmplY3QsIGtleSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cbmNsYXNzIE9iamVjdFJlZkltcGwge1xuICBjb25zdHJ1Y3Rvcihfb2JqZWN0LCBfa2V5LCBfZGVmYXVsdFZhbHVlKSB7XG4gICAgdGhpcy5fb2JqZWN0ID0gX29iamVjdDtcbiAgICB0aGlzLl9rZXkgPSBfa2V5O1xuICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IF9kZWZhdWx0VmFsdWU7XG4gICAgdGhpcy5fX3ZfaXNSZWYgPSB0cnVlO1xuICB9XG4gIGdldCB2YWx1ZSgpIHtcbiAgICBjb25zdCB2YWwgPSB0aGlzLl9vYmplY3RbdGhpcy5fa2V5XTtcbiAgICByZXR1cm4gdmFsID09PSB2b2lkIDAgPyB0aGlzLl9kZWZhdWx0VmFsdWUgOiB2YWw7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbCkge1xuICAgIHRoaXMuX29iamVjdFt0aGlzLl9rZXldID0gbmV3VmFsO1xuICB9XG4gIGdldCBkZXAoKSB7XG4gICAgcmV0dXJuIGdldERlcEZyb21SZWFjdGl2ZSh0b1Jhdyh0aGlzLl9vYmplY3QpLCB0aGlzLl9rZXkpO1xuICB9XG59XG5jbGFzcyBHZXR0ZXJSZWZJbXBsIHtcbiAgY29uc3RydWN0b3IoX2dldHRlcikge1xuICAgIHRoaXMuX2dldHRlciA9IF9nZXR0ZXI7XG4gICAgdGhpcy5fX3ZfaXNSZWYgPSB0cnVlO1xuICAgIHRoaXMuX192X2lzUmVhZG9ubHkgPSB0cnVlO1xuICB9XG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0dGVyKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIHRvUmVmKHNvdXJjZSwga2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKGlzUmVmKHNvdXJjZSkpIHtcbiAgICByZXR1cm4gc291cmNlO1xuICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oc291cmNlKSkge1xuICAgIHJldHVybiBuZXcgR2V0dGVyUmVmSW1wbChzb3VyY2UpO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNvdXJjZSkgJiYgYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gcHJvcGVydHlUb1JlZihzb3VyY2UsIGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmVmKHNvdXJjZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHByb3BlcnR5VG9SZWYoc291cmNlLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICBjb25zdCB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgcmV0dXJuIGlzUmVmKHZhbCkgPyB2YWwgOiBuZXcgT2JqZWN0UmVmSW1wbChcbiAgICBzb3VyY2UsXG4gICAga2V5LFxuICAgIGRlZmF1bHRWYWx1ZVxuICApO1xufVxuXG5jbGFzcyBDb21wdXRlZFJlZkltcGwge1xuICBjb25zdHJ1Y3RvcihnZXR0ZXIsIF9zZXR0ZXIsIGlzUmVhZG9ubHksIGlzU1NSKSB7XG4gICAgdGhpcy5fc2V0dGVyID0gX3NldHRlcjtcbiAgICB0aGlzLmRlcCA9IHZvaWQgMDtcbiAgICB0aGlzLl9fdl9pc1JlZiA9IHRydWU7XG4gICAgdGhpc1tcIl9fdl9pc1JlYWRvbmx5XCJdID0gZmFsc2U7XG4gICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgIHRoaXMuZWZmZWN0ID0gbmV3IFJlYWN0aXZlRWZmZWN0KGdldHRlciwgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9kaXJ0eSkge1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgICAgIHRyaWdnZXJSZWZWYWx1ZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmVmZmVjdC5jb21wdXRlZCA9IHRoaXM7XG4gICAgdGhpcy5lZmZlY3QuYWN0aXZlID0gdGhpcy5fY2FjaGVhYmxlID0gIWlzU1NSO1xuICAgIHRoaXNbXCJfX3ZfaXNSZWFkb25seVwiXSA9IGlzUmVhZG9ubHk7XG4gIH1cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0b1Jhdyh0aGlzKTtcbiAgICB0cmFja1JlZlZhbHVlKHNlbGYpO1xuICAgIGlmIChzZWxmLl9kaXJ0eSB8fCAhc2VsZi5fY2FjaGVhYmxlKSB7XG4gICAgICBzZWxmLl9kaXJ0eSA9IGZhbHNlO1xuICAgICAgc2VsZi5fdmFsdWUgPSBzZWxmLmVmZmVjdC5ydW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGYuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIHRoaXMuX3NldHRlcihuZXdWYWx1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGNvbXB1dGVkKGdldHRlck9yT3B0aW9ucywgZGVidWdPcHRpb25zLCBpc1NTUiA9IGZhbHNlKSB7XG4gIGxldCBnZXR0ZXI7XG4gIGxldCBzZXR0ZXI7XG4gIGNvbnN0IG9ubHlHZXR0ZXIgPSBpc0Z1bmN0aW9uKGdldHRlck9yT3B0aW9ucyk7XG4gIGlmIChvbmx5R2V0dGVyKSB7XG4gICAgZ2V0dGVyID0gZ2V0dGVyT3JPcHRpb25zO1xuICAgIHNldHRlciA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyAoKSA9PiB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXcml0ZSBvcGVyYXRpb24gZmFpbGVkOiBjb21wdXRlZCB2YWx1ZSBpcyByZWFkb25seVwiKTtcbiAgICB9IDogTk9PUDtcbiAgfSBlbHNlIHtcbiAgICBnZXR0ZXIgPSBnZXR0ZXJPck9wdGlvbnMuZ2V0O1xuICAgIHNldHRlciA9IGdldHRlck9yT3B0aW9ucy5zZXQ7XG4gIH1cbiAgY29uc3QgY1JlZiA9IG5ldyBDb21wdXRlZFJlZkltcGwoZ2V0dGVyLCBzZXR0ZXIsIG9ubHlHZXR0ZXIgfHwgIXNldHRlciwgaXNTU1IpO1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBkZWJ1Z09wdGlvbnMgJiYgIWlzU1NSKSB7XG4gICAgY1JlZi5lZmZlY3Qub25UcmFjayA9IGRlYnVnT3B0aW9ucy5vblRyYWNrO1xuICAgIGNSZWYuZWZmZWN0Lm9uVHJpZ2dlciA9IGRlYnVnT3B0aW9ucy5vblRyaWdnZXI7XG4gIH1cbiAgcmV0dXJuIGNSZWY7XG59XG5cbmNvbnN0IHRpY2sgPSAvKiBAX19QVVJFX18gKi8gUHJvbWlzZS5yZXNvbHZlKCk7XG5jb25zdCBxdWV1ZSA9IFtdO1xubGV0IHF1ZXVlZCA9IGZhbHNlO1xuY29uc3Qgc2NoZWR1bGVyID0gKGZuKSA9PiB7XG4gIHF1ZXVlLnB1c2goZm4pO1xuICBpZiAoIXF1ZXVlZCkge1xuICAgIHF1ZXVlZCA9IHRydWU7XG4gICAgdGljay50aGVuKGZsdXNoKTtcbiAgfVxufTtcbmNvbnN0IGZsdXNoID0gKCkgPT4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVldWVbaV0oKTtcbiAgfVxuICBxdWV1ZS5sZW5ndGggPSAwO1xuICBxdWV1ZWQgPSBmYWxzZTtcbn07XG5jbGFzcyBEZWZlcnJlZENvbXB1dGVkUmVmSW1wbCB7XG4gIGNvbnN0cnVjdG9yKGdldHRlcikge1xuICAgIHRoaXMuZGVwID0gdm9pZCAwO1xuICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB0aGlzLl9fdl9pc1JlZiA9IHRydWU7XG4gICAgdGhpc1tcIl9fdl9pc1JlYWRvbmx5XCJdID0gdHJ1ZTtcbiAgICBsZXQgY29tcGFyZVRhcmdldDtcbiAgICBsZXQgaGFzQ29tcGFyZVRhcmdldCA9IGZhbHNlO1xuICAgIGxldCBzY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmVmZmVjdCA9IG5ldyBSZWFjdGl2ZUVmZmVjdChnZXR0ZXIsIChjb21wdXRlZFRyaWdnZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmRlcCkge1xuICAgICAgICBpZiAoY29tcHV0ZWRUcmlnZ2VyKSB7XG4gICAgICAgICAgY29tcGFyZVRhcmdldCA9IHRoaXMuX3ZhbHVlO1xuICAgICAgICAgIGhhc0NvbXBhcmVUYXJnZXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCFzY2hlZHVsZWQpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZVRvQ29tcGFyZSA9IGhhc0NvbXBhcmVUYXJnZXQgPyBjb21wYXJlVGFyZ2V0IDogdGhpcy5fdmFsdWU7XG4gICAgICAgICAgc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICBoYXNDb21wYXJlVGFyZ2V0ID0gZmFsc2U7XG4gICAgICAgICAgc2NoZWR1bGVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVmZmVjdC5hY3RpdmUgJiYgdGhpcy5fZ2V0KCkgIT09IHZhbHVlVG9Db21wYXJlKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJSZWZWYWx1ZSh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZSBvZiB0aGlzLmRlcCkge1xuICAgICAgICAgIGlmIChlLmNvbXB1dGVkIGluc3RhbmNlb2YgRGVmZXJyZWRDb21wdXRlZFJlZkltcGwpIHtcbiAgICAgICAgICAgIGUuc2NoZWR1bGVyKFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgIC8qIGNvbXB1dGVkVHJpZ2dlciAqL1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLmVmZmVjdC5jb21wdXRlZCA9IHRoaXM7XG4gIH1cbiAgX2dldCgpIHtcbiAgICBpZiAodGhpcy5fZGlydHkpIHtcbiAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWUgPSB0aGlzLmVmZmVjdC5ydW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIGdldCB2YWx1ZSgpIHtcbiAgICB0cmFja1JlZlZhbHVlKHRoaXMpO1xuICAgIHJldHVybiB0b1Jhdyh0aGlzKS5fZ2V0KCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGRlZmVycmVkQ29tcHV0ZWQoZ2V0dGVyKSB7XG4gIHJldHVybiBuZXcgRGVmZXJyZWRDb21wdXRlZFJlZkltcGwoZ2V0dGVyKTtcbn1cblxuZXhwb3J0IHsgRWZmZWN0U2NvcGUsIElURVJBVEVfS0VZLCBSZWFjdGl2ZUVmZmVjdCwgY29tcHV0ZWQsIGN1c3RvbVJlZiwgZGVmZXJyZWRDb21wdXRlZCwgZWZmZWN0LCBlZmZlY3RTY29wZSwgZW5hYmxlVHJhY2tpbmcsIGdldEN1cnJlbnRTY29wZSwgaXNQcm94eSwgaXNSZWFjdGl2ZSwgaXNSZWFkb25seSwgaXNSZWYsIGlzU2hhbGxvdywgbWFya1Jhdywgb25TY29wZURpc3Bvc2UsIHBhdXNlVHJhY2tpbmcsIHByb3h5UmVmcywgcmVhY3RpdmUsIHJlYWRvbmx5LCByZWYsIHJlc2V0VHJhY2tpbmcsIHNoYWxsb3dSZWFjdGl2ZSwgc2hhbGxvd1JlYWRvbmx5LCBzaGFsbG93UmVmLCBzdG9wLCB0b1JhdywgdG9SZWYsIHRvUmVmcywgdG9WYWx1ZSwgdHJhY2ssIHRyaWdnZXIsIHRyaWdnZXJSZWYsIHVucmVmIH07XG4iLCJpbXBvcnQgeyBwYXVzZVRyYWNraW5nLCByZXNldFRyYWNraW5nLCBpc1JlZiwgdG9SYXcsIGdldEN1cnJlbnRTY29wZSwgaXNTaGFsbG93IGFzIGlzU2hhbGxvdyQxLCBpc1JlYWN0aXZlLCBSZWFjdGl2ZUVmZmVjdCwgcmVmLCBzaGFsbG93UmVhZG9ubHksIHRyYWNrLCByZWFjdGl2ZSwgc2hhbGxvd1JlYWN0aXZlLCB0cmlnZ2VyLCBpc1Byb3h5LCBwcm94eVJlZnMsIG1hcmtSYXcsIEVmZmVjdFNjb3BlLCBjb21wdXRlZCBhcyBjb21wdXRlZCQxLCBpc1JlYWRvbmx5IH0gZnJvbSAnQHZ1ZS9yZWFjdGl2aXR5JztcbmV4cG9ydCB7IEVmZmVjdFNjb3BlLCBSZWFjdGl2ZUVmZmVjdCwgY3VzdG9tUmVmLCBlZmZlY3QsIGVmZmVjdFNjb3BlLCBnZXRDdXJyZW50U2NvcGUsIGlzUHJveHksIGlzUmVhY3RpdmUsIGlzUmVhZG9ubHksIGlzUmVmLCBpc1NoYWxsb3csIG1hcmtSYXcsIG9uU2NvcGVEaXNwb3NlLCBwcm94eVJlZnMsIHJlYWN0aXZlLCByZWFkb25seSwgcmVmLCBzaGFsbG93UmVhY3RpdmUsIHNoYWxsb3dSZWFkb25seSwgc2hhbGxvd1JlZiwgc3RvcCwgdG9SYXcsIHRvUmVmLCB0b1JlZnMsIHRvVmFsdWUsIHRyaWdnZXJSZWYsIHVucmVmIH0gZnJvbSAnQHZ1ZS9yZWFjdGl2aXR5JztcbmltcG9ydCB7IGlzU3RyaW5nLCBpc0Z1bmN0aW9uLCBpc1Byb21pc2UsIGlzQXJyYXksIE5PT1AsIGdldEdsb2JhbFRoaXMsIGV4dGVuZCwgRU1QVFlfT0JKLCB0b0hhbmRsZXJLZXksIGxvb3NlVG9OdW1iZXIsIGh5cGhlbmF0ZSwgY2FtZWxpemUsIGlzT2JqZWN0LCBpc09uLCBoYXNPd24sIGlzTW9kZWxMaXN0ZW5lciwgdG9OdW1iZXIsIGhhc0NoYW5nZWQsIHJlbW92ZSwgaXNTZXQsIGlzTWFwLCBpc1BsYWluT2JqZWN0LCBpc0J1aWx0SW5EaXJlY3RpdmUsIGludm9rZUFycmF5Rm5zLCBpc1JlZ0V4cCwgY2FwaXRhbGl6ZSwgaXNHbG9iYWxseVdoaXRlbGlzdGVkLCBOTywgZGVmLCBpc1Jlc2VydmVkUHJvcCwgRU1QVFlfQVJSLCB0b1Jhd1R5cGUsIG1ha2VNYXAsIG5vcm1hbGl6ZUNsYXNzLCBub3JtYWxpemVTdHlsZSB9IGZyb20gJ0B2dWUvc2hhcmVkJztcbmV4cG9ydCB7IGNhbWVsaXplLCBjYXBpdGFsaXplLCBub3JtYWxpemVDbGFzcywgbm9ybWFsaXplUHJvcHMsIG5vcm1hbGl6ZVN0eWxlLCB0b0Rpc3BsYXlTdHJpbmcsIHRvSGFuZGxlcktleSB9IGZyb20gJ0B2dWUvc2hhcmVkJztcblxuY29uc3Qgc3RhY2sgPSBbXTtcbmZ1bmN0aW9uIHB1c2hXYXJuaW5nQ29udGV4dCh2bm9kZSkge1xuICBzdGFjay5wdXNoKHZub2RlKTtcbn1cbmZ1bmN0aW9uIHBvcFdhcm5pbmdDb250ZXh0KCkge1xuICBzdGFjay5wb3AoKTtcbn1cbmZ1bmN0aW9uIHdhcm4obXNnLCAuLi5hcmdzKSB7XG4gIGlmICghISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSlcbiAgICByZXR1cm47XG4gIHBhdXNlVHJhY2tpbmcoKTtcbiAgY29uc3QgaW5zdGFuY2UgPSBzdGFjay5sZW5ndGggPyBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5jb21wb25lbnQgOiBudWxsO1xuICBjb25zdCBhcHBXYXJuSGFuZGxlciA9IGluc3RhbmNlICYmIGluc3RhbmNlLmFwcENvbnRleHQuY29uZmlnLndhcm5IYW5kbGVyO1xuICBjb25zdCB0cmFjZSA9IGdldENvbXBvbmVudFRyYWNlKCk7XG4gIGlmIChhcHBXYXJuSGFuZGxlcikge1xuICAgIGNhbGxXaXRoRXJyb3JIYW5kbGluZyhcbiAgICAgIGFwcFdhcm5IYW5kbGVyLFxuICAgICAgaW5zdGFuY2UsXG4gICAgICAxMSxcbiAgICAgIFtcbiAgICAgICAgbXNnICsgYXJncy5qb2luKFwiXCIpLFxuICAgICAgICBpbnN0YW5jZSAmJiBpbnN0YW5jZS5wcm94eSxcbiAgICAgICAgdHJhY2UubWFwKFxuICAgICAgICAgICh7IHZub2RlIH0pID0+IGBhdCA8JHtmb3JtYXRDb21wb25lbnROYW1lKGluc3RhbmNlLCB2bm9kZS50eXBlKX0+YFxuICAgICAgICApLmpvaW4oXCJcXG5cIiksXG4gICAgICAgIHRyYWNlXG4gICAgICBdXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB3YXJuQXJncyA9IFtgW1Z1ZSB3YXJuXTogJHttc2d9YCwgLi4uYXJnc107XG4gICAgaWYgKHRyYWNlLmxlbmd0aCAmJiAvLyBhdm9pZCBzcGFtbWluZyBjb25zb2xlIGR1cmluZyB0ZXN0c1xuICAgIHRydWUpIHtcbiAgICAgIHdhcm5BcmdzLnB1c2goYFxuYCwgLi4uZm9ybWF0VHJhY2UodHJhY2UpKTtcbiAgICB9XG4gICAgY29uc29sZS53YXJuKC4uLndhcm5BcmdzKTtcbiAgfVxuICByZXNldFRyYWNraW5nKCk7XG59XG5mdW5jdGlvbiBnZXRDb21wb25lbnRUcmFjZSgpIHtcbiAgbGV0IGN1cnJlbnRWTm9kZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICBpZiAoIWN1cnJlbnRWTm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjb25zdCBub3JtYWxpemVkU3RhY2sgPSBbXTtcbiAgd2hpbGUgKGN1cnJlbnRWTm9kZSkge1xuICAgIGNvbnN0IGxhc3QgPSBub3JtYWxpemVkU3RhY2tbMF07XG4gICAgaWYgKGxhc3QgJiYgbGFzdC52bm9kZSA9PT0gY3VycmVudFZOb2RlKSB7XG4gICAgICBsYXN0LnJlY3Vyc2VDb3VudCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBub3JtYWxpemVkU3RhY2sucHVzaCh7XG4gICAgICAgIHZub2RlOiBjdXJyZW50Vk5vZGUsXG4gICAgICAgIHJlY3Vyc2VDb3VudDogMFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudEluc3RhbmNlID0gY3VycmVudFZOb2RlLmNvbXBvbmVudCAmJiBjdXJyZW50Vk5vZGUuY29tcG9uZW50LnBhcmVudDtcbiAgICBjdXJyZW50Vk5vZGUgPSBwYXJlbnRJbnN0YW5jZSAmJiBwYXJlbnRJbnN0YW5jZS52bm9kZTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZFN0YWNrO1xufVxuZnVuY3Rpb24gZm9ybWF0VHJhY2UodHJhY2UpIHtcbiAgY29uc3QgbG9ncyA9IFtdO1xuICB0cmFjZS5mb3JFYWNoKChlbnRyeSwgaSkgPT4ge1xuICAgIGxvZ3MucHVzaCguLi5pID09PSAwID8gW10gOiBbYFxuYF0sIC4uLmZvcm1hdFRyYWNlRW50cnkoZW50cnkpKTtcbiAgfSk7XG4gIHJldHVybiBsb2dzO1xufVxuZnVuY3Rpb24gZm9ybWF0VHJhY2VFbnRyeSh7IHZub2RlLCByZWN1cnNlQ291bnQgfSkge1xuICBjb25zdCBwb3N0Zml4ID0gcmVjdXJzZUNvdW50ID4gMCA/IGAuLi4gKCR7cmVjdXJzZUNvdW50fSByZWN1cnNpdmUgY2FsbHMpYCA6IGBgO1xuICBjb25zdCBpc1Jvb3QgPSB2bm9kZS5jb21wb25lbnQgPyB2bm9kZS5jb21wb25lbnQucGFyZW50ID09IG51bGwgOiBmYWxzZTtcbiAgY29uc3Qgb3BlbiA9IGAgYXQgPCR7Zm9ybWF0Q29tcG9uZW50TmFtZShcbiAgICB2bm9kZS5jb21wb25lbnQsXG4gICAgdm5vZGUudHlwZSxcbiAgICBpc1Jvb3RcbiAgKX1gO1xuICBjb25zdCBjbG9zZSA9IGA+YCArIHBvc3RmaXg7XG4gIHJldHVybiB2bm9kZS5wcm9wcyA/IFtvcGVuLCAuLi5mb3JtYXRQcm9wcyh2bm9kZS5wcm9wcyksIGNsb3NlXSA6IFtvcGVuICsgY2xvc2VdO1xufVxuZnVuY3Rpb24gZm9ybWF0UHJvcHMocHJvcHMpIHtcbiAgY29uc3QgcmVzID0gW107XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gIGtleXMuc2xpY2UoMCwgMykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgcmVzLnB1c2goLi4uZm9ybWF0UHJvcChrZXksIHByb3BzW2tleV0pKTtcbiAgfSk7XG4gIGlmIChrZXlzLmxlbmd0aCA+IDMpIHtcbiAgICByZXMucHVzaChgIC4uLmApO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBmb3JtYXRQcm9wKGtleSwgdmFsdWUsIHJhdykge1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgcmV0dXJuIHJhdyA/IHZhbHVlIDogW2Ake2tleX09JHt2YWx1ZX1gXTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIiB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHJhdyA/IHZhbHVlIDogW2Ake2tleX09JHt2YWx1ZX1gXTtcbiAgfSBlbHNlIGlmIChpc1JlZih2YWx1ZSkpIHtcbiAgICB2YWx1ZSA9IGZvcm1hdFByb3Aoa2V5LCB0b1Jhdyh2YWx1ZS52YWx1ZSksIHRydWUpO1xuICAgIHJldHVybiByYXcgPyB2YWx1ZSA6IFtgJHtrZXl9PVJlZjxgLCB2YWx1ZSwgYD5gXTtcbiAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHJldHVybiBbYCR7a2V5fT1mbiR7dmFsdWUubmFtZSA/IGA8JHt2YWx1ZS5uYW1lfT5gIDogYGB9YF07XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gICAgcmV0dXJuIHJhdyA/IHZhbHVlIDogW2Ake2tleX09YCwgdmFsdWVdO1xuICB9XG59XG5mdW5jdGlvbiBhc3NlcnROdW1iZXIodmFsLCB0eXBlKSB7XG4gIGlmICghISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSlcbiAgICByZXR1cm47XG4gIGlmICh2YWwgPT09IHZvaWQgMCkge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsICE9PSBcIm51bWJlclwiKSB7XG4gICAgd2FybihgJHt0eXBlfSBpcyBub3QgYSB2YWxpZCBudW1iZXIgLSBnb3QgJHtKU09OLnN0cmluZ2lmeSh2YWwpfS5gKTtcbiAgfSBlbHNlIGlmIChpc05hTih2YWwpKSB7XG4gICAgd2FybihgJHt0eXBlfSBpcyBOYU4gLSB0aGUgZHVyYXRpb24gZXhwcmVzc2lvbiBtaWdodCBiZSBpbmNvcnJlY3QuYCk7XG4gIH1cbn1cblxuY29uc3QgRXJyb3JUeXBlU3RyaW5ncyA9IHtcbiAgW1wic3BcIl06IFwic2VydmVyUHJlZmV0Y2ggaG9va1wiLFxuICBbXCJiY1wiXTogXCJiZWZvcmVDcmVhdGUgaG9va1wiLFxuICBbXCJjXCJdOiBcImNyZWF0ZWQgaG9va1wiLFxuICBbXCJibVwiXTogXCJiZWZvcmVNb3VudCBob29rXCIsXG4gIFtcIm1cIl06IFwibW91bnRlZCBob29rXCIsXG4gIFtcImJ1XCJdOiBcImJlZm9yZVVwZGF0ZSBob29rXCIsXG4gIFtcInVcIl06IFwidXBkYXRlZFwiLFxuICBbXCJidW1cIl06IFwiYmVmb3JlVW5tb3VudCBob29rXCIsXG4gIFtcInVtXCJdOiBcInVubW91bnRlZCBob29rXCIsXG4gIFtcImFcIl06IFwiYWN0aXZhdGVkIGhvb2tcIixcbiAgW1wiZGFcIl06IFwiZGVhY3RpdmF0ZWQgaG9va1wiLFxuICBbXCJlY1wiXTogXCJlcnJvckNhcHR1cmVkIGhvb2tcIixcbiAgW1wicnRjXCJdOiBcInJlbmRlclRyYWNrZWQgaG9va1wiLFxuICBbXCJydGdcIl06IFwicmVuZGVyVHJpZ2dlcmVkIGhvb2tcIixcbiAgWzBdOiBcInNldHVwIGZ1bmN0aW9uXCIsXG4gIFsxXTogXCJyZW5kZXIgZnVuY3Rpb25cIixcbiAgWzJdOiBcIndhdGNoZXIgZ2V0dGVyXCIsXG4gIFszXTogXCJ3YXRjaGVyIGNhbGxiYWNrXCIsXG4gIFs0XTogXCJ3YXRjaGVyIGNsZWFudXAgZnVuY3Rpb25cIixcbiAgWzVdOiBcIm5hdGl2ZSBldmVudCBoYW5kbGVyXCIsXG4gIFs2XTogXCJjb21wb25lbnQgZXZlbnQgaGFuZGxlclwiLFxuICBbN106IFwidm5vZGUgaG9va1wiLFxuICBbOF06IFwiZGlyZWN0aXZlIGhvb2tcIixcbiAgWzldOiBcInRyYW5zaXRpb24gaG9va1wiLFxuICBbMTBdOiBcImFwcCBlcnJvckhhbmRsZXJcIixcbiAgWzExXTogXCJhcHAgd2FybkhhbmRsZXJcIixcbiAgWzEyXTogXCJyZWYgZnVuY3Rpb25cIixcbiAgWzEzXTogXCJhc3luYyBjb21wb25lbnQgbG9hZGVyXCIsXG4gIFsxNF06IFwic2NoZWR1bGVyIGZsdXNoLiBUaGlzIGlzIGxpa2VseSBhIFZ1ZSBpbnRlcm5hbHMgYnVnLiBQbGVhc2Ugb3BlbiBhbiBpc3N1ZSBhdCBodHRwczovL25ldy1pc3N1ZS52dWVqcy5vcmcvP3JlcG89dnVlanMvY29yZVwiXG59O1xuZnVuY3Rpb24gY2FsbFdpdGhFcnJvckhhbmRsaW5nKGZuLCBpbnN0YW5jZSwgdHlwZSwgYXJncykge1xuICBsZXQgcmVzO1xuICB0cnkge1xuICAgIHJlcyA9IGFyZ3MgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGhhbmRsZUVycm9yKGVyciwgaW5zdGFuY2UsIHR5cGUpO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhmbiwgaW5zdGFuY2UsIHR5cGUsIGFyZ3MpIHtcbiAgaWYgKGlzRnVuY3Rpb24oZm4pKSB7XG4gICAgY29uc3QgcmVzID0gY2FsbFdpdGhFcnJvckhhbmRsaW5nKGZuLCBpbnN0YW5jZSwgdHlwZSwgYXJncyk7XG4gICAgaWYgKHJlcyAmJiBpc1Byb21pc2UocmVzKSkge1xuICAgICAgcmVzLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaGFuZGxlRXJyb3IoZXJyLCBpbnN0YW5jZSwgdHlwZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbi5sZW5ndGg7IGkrKykge1xuICAgIHZhbHVlcy5wdXNoKGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKGZuW2ldLCBpbnN0YW5jZSwgdHlwZSwgYXJncykpO1xuICB9XG4gIHJldHVybiB2YWx1ZXM7XG59XG5mdW5jdGlvbiBoYW5kbGVFcnJvcihlcnIsIGluc3RhbmNlLCB0eXBlLCB0aHJvd0luRGV2ID0gdHJ1ZSkge1xuICBjb25zdCBjb250ZXh0Vk5vZGUgPSBpbnN0YW5jZSA/IGluc3RhbmNlLnZub2RlIDogbnVsbDtcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgbGV0IGN1ciA9IGluc3RhbmNlLnBhcmVudDtcbiAgICBjb25zdCBleHBvc2VkSW5zdGFuY2UgPSBpbnN0YW5jZS5wcm94eTtcbiAgICBjb25zdCBlcnJvckluZm8gPSAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpID8gRXJyb3JUeXBlU3RyaW5nc1t0eXBlXSA6IHR5cGU7XG4gICAgd2hpbGUgKGN1cikge1xuICAgICAgY29uc3QgZXJyb3JDYXB0dXJlZEhvb2tzID0gY3VyLmVjO1xuICAgICAgaWYgKGVycm9yQ2FwdHVyZWRIb29rcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yQ2FwdHVyZWRIb29rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChlcnJvckNhcHR1cmVkSG9va3NbaV0oZXJyLCBleHBvc2VkSW5zdGFuY2UsIGVycm9ySW5mbykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdXIgPSBjdXIucGFyZW50O1xuICAgIH1cbiAgICBjb25zdCBhcHBFcnJvckhhbmRsZXIgPSBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5lcnJvckhhbmRsZXI7XG4gICAgaWYgKGFwcEVycm9ySGFuZGxlcikge1xuICAgICAgY2FsbFdpdGhFcnJvckhhbmRsaW5nKFxuICAgICAgICBhcHBFcnJvckhhbmRsZXIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIDEwLFxuICAgICAgICBbZXJyLCBleHBvc2VkSW5zdGFuY2UsIGVycm9ySW5mb11cbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGxvZ0Vycm9yKGVyciwgdHlwZSwgY29udGV4dFZOb2RlLCB0aHJvd0luRGV2KTtcbn1cbmZ1bmN0aW9uIGxvZ0Vycm9yKGVyciwgdHlwZSwgY29udGV4dFZOb2RlLCB0aHJvd0luRGV2ID0gdHJ1ZSkge1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIGNvbnN0IGluZm8gPSBFcnJvclR5cGVTdHJpbmdzW3R5cGVdO1xuICAgIGlmIChjb250ZXh0Vk5vZGUpIHtcbiAgICAgIHB1c2hXYXJuaW5nQ29udGV4dChjb250ZXh0Vk5vZGUpO1xuICAgIH1cbiAgICB3YXJuKGBVbmhhbmRsZWQgZXJyb3Ike2luZm8gPyBgIGR1cmluZyBleGVjdXRpb24gb2YgJHtpbmZvfWAgOiBgYH1gKTtcbiAgICBpZiAoY29udGV4dFZOb2RlKSB7XG4gICAgICBwb3BXYXJuaW5nQ29udGV4dCgpO1xuICAgIH1cbiAgICBpZiAodGhyb3dJbkRldikge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5sZXQgaXNGbHVzaGluZyA9IGZhbHNlO1xubGV0IGlzRmx1c2hQZW5kaW5nID0gZmFsc2U7XG5jb25zdCBxdWV1ZSA9IFtdO1xubGV0IGZsdXNoSW5kZXggPSAwO1xuY29uc3QgcGVuZGluZ1Bvc3RGbHVzaENicyA9IFtdO1xubGV0IGFjdGl2ZVBvc3RGbHVzaENicyA9IG51bGw7XG5sZXQgcG9zdEZsdXNoSW5kZXggPSAwO1xuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gLyogQF9fUFVSRV9fICovIFByb21pc2UucmVzb2x2ZSgpO1xubGV0IGN1cnJlbnRGbHVzaFByb21pc2UgPSBudWxsO1xuY29uc3QgUkVDVVJTSU9OX0xJTUlUID0gMTAwO1xuZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgY29uc3QgcCA9IGN1cnJlbnRGbHVzaFByb21pc2UgfHwgcmVzb2x2ZWRQcm9taXNlO1xuICByZXR1cm4gZm4gPyBwLnRoZW4odGhpcyA/IGZuLmJpbmQodGhpcykgOiBmbikgOiBwO1xufVxuZnVuY3Rpb24gZmluZEluc2VydGlvbkluZGV4KGlkKSB7XG4gIGxldCBzdGFydCA9IGZsdXNoSW5kZXggKyAxO1xuICBsZXQgZW5kID0gcXVldWUubGVuZ3RoO1xuICB3aGlsZSAoc3RhcnQgPCBlbmQpIHtcbiAgICBjb25zdCBtaWRkbGUgPSBzdGFydCArIGVuZCA+Pj4gMTtcbiAgICBjb25zdCBtaWRkbGVKb2JJZCA9IGdldElkKHF1ZXVlW21pZGRsZV0pO1xuICAgIG1pZGRsZUpvYklkIDwgaWQgPyBzdGFydCA9IG1pZGRsZSArIDEgOiBlbmQgPSBtaWRkbGU7XG4gIH1cbiAgcmV0dXJuIHN0YXJ0O1xufVxuZnVuY3Rpb24gcXVldWVKb2Ioam9iKSB7XG4gIGlmICghcXVldWUubGVuZ3RoIHx8ICFxdWV1ZS5pbmNsdWRlcyhcbiAgICBqb2IsXG4gICAgaXNGbHVzaGluZyAmJiBqb2IuYWxsb3dSZWN1cnNlID8gZmx1c2hJbmRleCArIDEgOiBmbHVzaEluZGV4XG4gICkpIHtcbiAgICBpZiAoam9iLmlkID09IG51bGwpIHtcbiAgICAgIHF1ZXVlLnB1c2goam9iKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVldWUuc3BsaWNlKGZpbmRJbnNlcnRpb25JbmRleChqb2IuaWQpLCAwLCBqb2IpO1xuICAgIH1cbiAgICBxdWV1ZUZsdXNoKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIHF1ZXVlRmx1c2goKSB7XG4gIGlmICghaXNGbHVzaGluZyAmJiAhaXNGbHVzaFBlbmRpbmcpIHtcbiAgICBpc0ZsdXNoUGVuZGluZyA9IHRydWU7XG4gICAgY3VycmVudEZsdXNoUHJvbWlzZSA9IHJlc29sdmVkUHJvbWlzZS50aGVuKGZsdXNoSm9icyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGludmFsaWRhdGVKb2Ioam9iKSB7XG4gIGNvbnN0IGkgPSBxdWV1ZS5pbmRleE9mKGpvYik7XG4gIGlmIChpID4gZmx1c2hJbmRleCkge1xuICAgIHF1ZXVlLnNwbGljZShpLCAxKTtcbiAgfVxufVxuZnVuY3Rpb24gcXVldWVQb3N0Rmx1c2hDYihjYikge1xuICBpZiAoIWlzQXJyYXkoY2IpKSB7XG4gICAgaWYgKCFhY3RpdmVQb3N0Rmx1c2hDYnMgfHwgIWFjdGl2ZVBvc3RGbHVzaENicy5pbmNsdWRlcyhcbiAgICAgIGNiLFxuICAgICAgY2IuYWxsb3dSZWN1cnNlID8gcG9zdEZsdXNoSW5kZXggKyAxIDogcG9zdEZsdXNoSW5kZXhcbiAgICApKSB7XG4gICAgICBwZW5kaW5nUG9zdEZsdXNoQ2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwZW5kaW5nUG9zdEZsdXNoQ2JzLnB1c2goLi4uY2IpO1xuICB9XG4gIHF1ZXVlRmx1c2goKTtcbn1cbmZ1bmN0aW9uIGZsdXNoUHJlRmx1c2hDYnMoc2VlbiwgaSA9IGlzRmx1c2hpbmcgPyBmbHVzaEluZGV4ICsgMSA6IDApIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICBzZWVuID0gc2VlbiB8fCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICB9XG4gIGZvciAoOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjYiA9IHF1ZXVlW2ldO1xuICAgIGlmIChjYiAmJiBjYi5wcmUpIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGNoZWNrUmVjdXJzaXZlVXBkYXRlcyhzZWVuLCBjYikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBxdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICBpLS07XG4gICAgICBjYigpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZmx1c2hQb3N0Rmx1c2hDYnMoc2Vlbikge1xuICBpZiAocGVuZGluZ1Bvc3RGbHVzaENicy5sZW5ndGgpIHtcbiAgICBjb25zdCBkZWR1cGVkID0gWy4uLm5ldyBTZXQocGVuZGluZ1Bvc3RGbHVzaENicyldO1xuICAgIHBlbmRpbmdQb3N0Rmx1c2hDYnMubGVuZ3RoID0gMDtcbiAgICBpZiAoYWN0aXZlUG9zdEZsdXNoQ2JzKSB7XG4gICAgICBhY3RpdmVQb3N0Rmx1c2hDYnMucHVzaCguLi5kZWR1cGVkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWN0aXZlUG9zdEZsdXNoQ2JzID0gZGVkdXBlZDtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgc2VlbiA9IHNlZW4gfHwgLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICB9XG4gICAgYWN0aXZlUG9zdEZsdXNoQ2JzLnNvcnQoKGEsIGIpID0+IGdldElkKGEpIC0gZ2V0SWQoYikpO1xuICAgIGZvciAocG9zdEZsdXNoSW5kZXggPSAwOyBwb3N0Rmx1c2hJbmRleCA8IGFjdGl2ZVBvc3RGbHVzaENicy5sZW5ndGg7IHBvc3RGbHVzaEluZGV4KyspIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGNoZWNrUmVjdXJzaXZlVXBkYXRlcyhzZWVuLCBhY3RpdmVQb3N0Rmx1c2hDYnNbcG9zdEZsdXNoSW5kZXhdKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZVBvc3RGbHVzaENic1twb3N0Rmx1c2hJbmRleF0oKTtcbiAgICB9XG4gICAgYWN0aXZlUG9zdEZsdXNoQ2JzID0gbnVsbDtcbiAgICBwb3N0Rmx1c2hJbmRleCA9IDA7XG4gIH1cbn1cbmNvbnN0IGdldElkID0gKGpvYikgPT4gam9iLmlkID09IG51bGwgPyBJbmZpbml0eSA6IGpvYi5pZDtcbmNvbnN0IGNvbXBhcmF0b3IgPSAoYSwgYikgPT4ge1xuICBjb25zdCBkaWZmID0gZ2V0SWQoYSkgLSBnZXRJZChiKTtcbiAgaWYgKGRpZmYgPT09IDApIHtcbiAgICBpZiAoYS5wcmUgJiYgIWIucHJlKVxuICAgICAgcmV0dXJuIC0xO1xuICAgIGlmIChiLnByZSAmJiAhYS5wcmUpXG4gICAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gZGlmZjtcbn07XG5mdW5jdGlvbiBmbHVzaEpvYnMoc2Vlbikge1xuICBpc0ZsdXNoUGVuZGluZyA9IGZhbHNlO1xuICBpc0ZsdXNoaW5nID0gdHJ1ZTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICBzZWVuID0gc2VlbiB8fCAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICB9XG4gIHF1ZXVlLnNvcnQoY29tcGFyYXRvcik7XG4gIGNvbnN0IGNoZWNrID0gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IChqb2IpID0+IGNoZWNrUmVjdXJzaXZlVXBkYXRlcyhzZWVuLCBqb2IpIDogTk9PUDtcbiAgdHJ5IHtcbiAgICBmb3IgKGZsdXNoSW5kZXggPSAwOyBmbHVzaEluZGV4IDwgcXVldWUubGVuZ3RoOyBmbHVzaEluZGV4KyspIHtcbiAgICAgIGNvbnN0IGpvYiA9IHF1ZXVlW2ZsdXNoSW5kZXhdO1xuICAgICAgaWYgKGpvYiAmJiBqb2IuYWN0aXZlICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBjaGVjayhqb2IpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbFdpdGhFcnJvckhhbmRsaW5nKGpvYiwgbnVsbCwgMTQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBmbHVzaEluZGV4ID0gMDtcbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGZsdXNoUG9zdEZsdXNoQ2JzKHNlZW4pO1xuICAgIGlzRmx1c2hpbmcgPSBmYWxzZTtcbiAgICBjdXJyZW50Rmx1c2hQcm9taXNlID0gbnVsbDtcbiAgICBpZiAocXVldWUubGVuZ3RoIHx8IHBlbmRpbmdQb3N0Rmx1c2hDYnMubGVuZ3RoKSB7XG4gICAgICBmbHVzaEpvYnMoc2Vlbik7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBjaGVja1JlY3Vyc2l2ZVVwZGF0ZXMoc2VlbiwgZm4pIHtcbiAgaWYgKCFzZWVuLmhhcyhmbikpIHtcbiAgICBzZWVuLnNldChmbiwgMSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY291bnQgPSBzZWVuLmdldChmbik7XG4gICAgaWYgKGNvdW50ID4gUkVDVVJTSU9OX0xJTUlUKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGZuLm93bmVySW5zdGFuY2U7XG4gICAgICBjb25zdCBjb21wb25lbnROYW1lID0gaW5zdGFuY2UgJiYgZ2V0Q29tcG9uZW50TmFtZShpbnN0YW5jZS50eXBlKTtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBNYXhpbXVtIHJlY3Vyc2l2ZSB1cGRhdGVzIGV4Y2VlZGVkJHtjb21wb25lbnROYW1lID8gYCBpbiBjb21wb25lbnQgPCR7Y29tcG9uZW50TmFtZX0+YCA6IGBgfS4gVGhpcyBtZWFucyB5b3UgaGF2ZSBhIHJlYWN0aXZlIGVmZmVjdCB0aGF0IGlzIG11dGF0aW5nIGl0cyBvd24gZGVwZW5kZW5jaWVzIGFuZCB0aHVzIHJlY3Vyc2l2ZWx5IHRyaWdnZXJpbmcgaXRzZWxmLiBQb3NzaWJsZSBzb3VyY2VzIGluY2x1ZGUgY29tcG9uZW50IHRlbXBsYXRlLCByZW5kZXIgZnVuY3Rpb24sIHVwZGF0ZWQgaG9vayBvciB3YXRjaGVyIHNvdXJjZSBmdW5jdGlvbi5gXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlZW4uc2V0KGZuLCBjb3VudCArIDEpO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgaXNIbXJVcGRhdGluZyA9IGZhbHNlO1xuY29uc3QgaG1yRGlydHlDb21wb25lbnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcbmlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gIGdldEdsb2JhbFRoaXMoKS5fX1ZVRV9ITVJfUlVOVElNRV9fID0ge1xuICAgIGNyZWF0ZVJlY29yZDogdHJ5V3JhcChjcmVhdGVSZWNvcmQpLFxuICAgIHJlcmVuZGVyOiB0cnlXcmFwKHJlcmVuZGVyKSxcbiAgICByZWxvYWQ6IHRyeVdyYXAocmVsb2FkKVxuICB9O1xufVxuY29uc3QgbWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbmZ1bmN0aW9uIHJlZ2lzdGVySE1SKGluc3RhbmNlKSB7XG4gIGNvbnN0IGlkID0gaW5zdGFuY2UudHlwZS5fX2htcklkO1xuICBsZXQgcmVjb3JkID0gbWFwLmdldChpZCk7XG4gIGlmICghcmVjb3JkKSB7XG4gICAgY3JlYXRlUmVjb3JkKGlkLCBpbnN0YW5jZS50eXBlKTtcbiAgICByZWNvcmQgPSBtYXAuZ2V0KGlkKTtcbiAgfVxuICByZWNvcmQuaW5zdGFuY2VzLmFkZChpbnN0YW5jZSk7XG59XG5mdW5jdGlvbiB1bnJlZ2lzdGVySE1SKGluc3RhbmNlKSB7XG4gIG1hcC5nZXQoaW5zdGFuY2UudHlwZS5fX2htcklkKS5pbnN0YW5jZXMuZGVsZXRlKGluc3RhbmNlKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlY29yZChpZCwgaW5pdGlhbERlZikge1xuICBpZiAobWFwLmhhcyhpZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgbWFwLnNldChpZCwge1xuICAgIGluaXRpYWxEZWY6IG5vcm1hbGl6ZUNsYXNzQ29tcG9uZW50KGluaXRpYWxEZWYpLFxuICAgIGluc3RhbmNlczogLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKVxuICB9KTtcbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBub3JtYWxpemVDbGFzc0NvbXBvbmVudChjb21wb25lbnQpIHtcbiAgcmV0dXJuIGlzQ2xhc3NDb21wb25lbnQoY29tcG9uZW50KSA/IGNvbXBvbmVudC5fX3ZjY09wdHMgOiBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiByZXJlbmRlcihpZCwgbmV3UmVuZGVyKSB7XG4gIGNvbnN0IHJlY29yZCA9IG1hcC5nZXQoaWQpO1xuICBpZiAoIXJlY29yZCkge1xuICAgIHJldHVybjtcbiAgfVxuICByZWNvcmQuaW5pdGlhbERlZi5yZW5kZXIgPSBuZXdSZW5kZXI7XG4gIFsuLi5yZWNvcmQuaW5zdGFuY2VzXS5mb3JFYWNoKChpbnN0YW5jZSkgPT4ge1xuICAgIGlmIChuZXdSZW5kZXIpIHtcbiAgICAgIGluc3RhbmNlLnJlbmRlciA9IG5ld1JlbmRlcjtcbiAgICAgIG5vcm1hbGl6ZUNsYXNzQ29tcG9uZW50KGluc3RhbmNlLnR5cGUpLnJlbmRlciA9IG5ld1JlbmRlcjtcbiAgICB9XG4gICAgaW5zdGFuY2UucmVuZGVyQ2FjaGUgPSBbXTtcbiAgICBpc0htclVwZGF0aW5nID0gdHJ1ZTtcbiAgICBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICBpc0htclVwZGF0aW5nID0gZmFsc2U7XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVsb2FkKGlkLCBuZXdDb21wKSB7XG4gIGNvbnN0IHJlY29yZCA9IG1hcC5nZXQoaWQpO1xuICBpZiAoIXJlY29yZClcbiAgICByZXR1cm47XG4gIG5ld0NvbXAgPSBub3JtYWxpemVDbGFzc0NvbXBvbmVudChuZXdDb21wKTtcbiAgdXBkYXRlQ29tcG9uZW50RGVmKHJlY29yZC5pbml0aWFsRGVmLCBuZXdDb21wKTtcbiAgY29uc3QgaW5zdGFuY2VzID0gWy4uLnJlY29yZC5pbnN0YW5jZXNdO1xuICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgIGNvbnN0IG9sZENvbXAgPSBub3JtYWxpemVDbGFzc0NvbXBvbmVudChpbnN0YW5jZS50eXBlKTtcbiAgICBpZiAoIWhtckRpcnR5Q29tcG9uZW50cy5oYXMob2xkQ29tcCkpIHtcbiAgICAgIGlmIChvbGRDb21wICE9PSByZWNvcmQuaW5pdGlhbERlZikge1xuICAgICAgICB1cGRhdGVDb21wb25lbnREZWYob2xkQ29tcCwgbmV3Q29tcCk7XG4gICAgICB9XG4gICAgICBobXJEaXJ0eUNvbXBvbmVudHMuYWRkKG9sZENvbXApO1xuICAgIH1cbiAgICBpbnN0YW5jZS5hcHBDb250ZXh0LnByb3BzQ2FjaGUuZGVsZXRlKGluc3RhbmNlLnR5cGUpO1xuICAgIGluc3RhbmNlLmFwcENvbnRleHQuZW1pdHNDYWNoZS5kZWxldGUoaW5zdGFuY2UudHlwZSk7XG4gICAgaW5zdGFuY2UuYXBwQ29udGV4dC5vcHRpb25zQ2FjaGUuZGVsZXRlKGluc3RhbmNlLnR5cGUpO1xuICAgIGlmIChpbnN0YW5jZS5jZVJlbG9hZCkge1xuICAgICAgaG1yRGlydHlDb21wb25lbnRzLmFkZChvbGRDb21wKTtcbiAgICAgIGluc3RhbmNlLmNlUmVsb2FkKG5ld0NvbXAuc3R5bGVzKTtcbiAgICAgIGhtckRpcnR5Q29tcG9uZW50cy5kZWxldGUob2xkQ29tcCk7XG4gICAgfSBlbHNlIGlmIChpbnN0YW5jZS5wYXJlbnQpIHtcbiAgICAgIHF1ZXVlSm9iKGluc3RhbmNlLnBhcmVudC51cGRhdGUpO1xuICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuYXBwQ29udGV4dC5yZWxvYWQpIHtcbiAgICAgIGluc3RhbmNlLmFwcENvbnRleHQucmVsb2FkKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJbSE1SXSBSb290IG9yIG1hbnVhbGx5IG1vdW50ZWQgaW5zdGFuY2UgbW9kaWZpZWQuIEZ1bGwgcmVsb2FkIHJlcXVpcmVkLlwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBxdWV1ZVBvc3RGbHVzaENiKCgpID0+IHtcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgICAgaG1yRGlydHlDb21wb25lbnRzLmRlbGV0ZShcbiAgICAgICAgbm9ybWFsaXplQ2xhc3NDb21wb25lbnQoaW5zdGFuY2UudHlwZSlcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudERlZihvbGRDb21wLCBuZXdDb21wKSB7XG4gIGV4dGVuZChvbGRDb21wLCBuZXdDb21wKTtcbiAgZm9yIChjb25zdCBrZXkgaW4gb2xkQ29tcCkge1xuICAgIGlmIChrZXkgIT09IFwiX19maWxlXCIgJiYgIShrZXkgaW4gbmV3Q29tcCkpIHtcbiAgICAgIGRlbGV0ZSBvbGRDb21wW2tleV07XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cnlXcmFwKGZuKSB7XG4gIHJldHVybiAoaWQsIGFyZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4oaWQsIGFyZyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYFtITVJdIFNvbWV0aGluZyB3ZW50IHdyb25nIGR1cmluZyBWdWUgY29tcG9uZW50IGhvdC1yZWxvYWQuIEZ1bGwgcmVsb2FkIHJlcXVpcmVkLmBcbiAgICAgICk7XG4gICAgfVxuICB9O1xufVxuXG5sZXQgZGV2dG9vbHM7XG5sZXQgYnVmZmVyID0gW107XG5sZXQgZGV2dG9vbHNOb3RJbnN0YWxsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIGVtaXQkMShldmVudCwgLi4uYXJncykge1xuICBpZiAoZGV2dG9vbHMpIHtcbiAgICBkZXZ0b29scy5lbWl0KGV2ZW50LCAuLi5hcmdzKTtcbiAgfSBlbHNlIGlmICghZGV2dG9vbHNOb3RJbnN0YWxsZWQpIHtcbiAgICBidWZmZXIucHVzaCh7IGV2ZW50LCBhcmdzIH0pO1xuICB9XG59XG5mdW5jdGlvbiBzZXREZXZ0b29sc0hvb2soaG9vaywgdGFyZ2V0KSB7XG4gIHZhciBfYSwgX2I7XG4gIGRldnRvb2xzID0gaG9vaztcbiAgaWYgKGRldnRvb2xzKSB7XG4gICAgZGV2dG9vbHMuZW5hYmxlZCA9IHRydWU7XG4gICAgYnVmZmVyLmZvckVhY2goKHsgZXZlbnQsIGFyZ3MgfSkgPT4gZGV2dG9vbHMuZW1pdChldmVudCwgLi4uYXJncykpO1xuICAgIGJ1ZmZlciA9IFtdO1xuICB9IGVsc2UgaWYgKFxuICAgIC8vIGhhbmRsZSBsYXRlIGRldnRvb2xzIGluamVjdGlvbiAtIG9ubHkgZG8gdGhpcyBpZiB3ZSBhcmUgaW4gYW4gYWN0dWFsXG4gICAgLy8gYnJvd3NlciBlbnZpcm9ubWVudCB0byBhdm9pZCB0aGUgdGltZXIgaGFuZGxlIHN0YWxsaW5nIHRlc3QgcnVubmVyIGV4aXRcbiAgICAvLyAoIzQ4MTUpXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAvLyBzb21lIGVudnMgbW9jayB3aW5kb3cgYnV0IG5vdCBmdWxseVxuICAgIHdpbmRvdy5IVE1MRWxlbWVudCAmJiAvLyBhbHNvIGV4Y2x1ZGUganNkb21cbiAgICAhKChfYiA9IChfYSA9IHdpbmRvdy5uYXZpZ2F0b3IpID09IG51bGwgPyB2b2lkIDAgOiBfYS51c2VyQWdlbnQpID09IG51bGwgPyB2b2lkIDAgOiBfYi5pbmNsdWRlcyhcImpzZG9tXCIpKVxuICApIHtcbiAgICBjb25zdCByZXBsYXkgPSB0YXJnZXQuX19WVUVfREVWVE9PTFNfSE9PS19SRVBMQVlfXyA9IHRhcmdldC5fX1ZVRV9ERVZUT09MU19IT09LX1JFUExBWV9fIHx8IFtdO1xuICAgIHJlcGxheS5wdXNoKChuZXdIb29rKSA9PiB7XG4gICAgICBzZXREZXZ0b29sc0hvb2sobmV3SG9vaywgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghZGV2dG9vbHMpIHtcbiAgICAgICAgdGFyZ2V0Ll9fVlVFX0RFVlRPT0xTX0hPT0tfUkVQTEFZX18gPSBudWxsO1xuICAgICAgICBkZXZ0b29sc05vdEluc3RhbGxlZCA9IHRydWU7XG4gICAgICAgIGJ1ZmZlciA9IFtdO1xuICAgICAgfVxuICAgIH0sIDNlMyk7XG4gIH0gZWxzZSB7XG4gICAgZGV2dG9vbHNOb3RJbnN0YWxsZWQgPSB0cnVlO1xuICAgIGJ1ZmZlciA9IFtdO1xuICB9XG59XG5mdW5jdGlvbiBkZXZ0b29sc0luaXRBcHAoYXBwLCB2ZXJzaW9uKSB7XG4gIGVtaXQkMShcImFwcDppbml0XCIgLyogQVBQX0lOSVQgKi8sIGFwcCwgdmVyc2lvbiwge1xuICAgIEZyYWdtZW50LFxuICAgIFRleHQsXG4gICAgQ29tbWVudCxcbiAgICBTdGF0aWNcbiAgfSk7XG59XG5mdW5jdGlvbiBkZXZ0b29sc1VubW91bnRBcHAoYXBwKSB7XG4gIGVtaXQkMShcImFwcDp1bm1vdW50XCIgLyogQVBQX1VOTU9VTlQgKi8sIGFwcCk7XG59XG5jb25zdCBkZXZ0b29sc0NvbXBvbmVudEFkZGVkID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZURldnRvb2xzQ29tcG9uZW50SG9vayhcbiAgXCJjb21wb25lbnQ6YWRkZWRcIiAvKiBDT01QT05FTlRfQURERUQgKi9cbik7XG5jb25zdCBkZXZ0b29sc0NvbXBvbmVudFVwZGF0ZWQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlRGV2dG9vbHNDb21wb25lbnRIb29rKFwiY29tcG9uZW50OnVwZGF0ZWRcIiAvKiBDT01QT05FTlRfVVBEQVRFRCAqLyk7XG5jb25zdCBfZGV2dG9vbHNDb21wb25lbnRSZW1vdmVkID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZURldnRvb2xzQ29tcG9uZW50SG9vayhcbiAgXCJjb21wb25lbnQ6cmVtb3ZlZFwiIC8qIENPTVBPTkVOVF9SRU1PVkVEICovXG4pO1xuY29uc3QgZGV2dG9vbHNDb21wb25lbnRSZW1vdmVkID0gKGNvbXBvbmVudCkgPT4ge1xuICBpZiAoZGV2dG9vbHMgJiYgdHlwZW9mIGRldnRvb2xzLmNsZWFudXBCdWZmZXIgPT09IFwiZnVuY3Rpb25cIiAmJiAvLyByZW1vdmUgdGhlIGNvbXBvbmVudCBpZiBpdCB3YXNuJ3QgYnVmZmVyZWRcbiAgIWRldnRvb2xzLmNsZWFudXBCdWZmZXIoY29tcG9uZW50KSkge1xuICAgIF9kZXZ0b29sc0NvbXBvbmVudFJlbW92ZWQoY29tcG9uZW50KTtcbiAgfVxufTtcbmZ1bmN0aW9uIGNyZWF0ZURldnRvb2xzQ29tcG9uZW50SG9vayhob29rKSB7XG4gIHJldHVybiAoY29tcG9uZW50KSA9PiB7XG4gICAgZW1pdCQxKFxuICAgICAgaG9vayxcbiAgICAgIGNvbXBvbmVudC5hcHBDb250ZXh0LmFwcCxcbiAgICAgIGNvbXBvbmVudC51aWQsXG4gICAgICBjb21wb25lbnQucGFyZW50ID8gY29tcG9uZW50LnBhcmVudC51aWQgOiB2b2lkIDAsXG4gICAgICBjb21wb25lbnRcbiAgICApO1xuICB9O1xufVxuY29uc3QgZGV2dG9vbHNQZXJmU3RhcnQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlRGV2dG9vbHNQZXJmb3JtYW5jZUhvb2soXG4gIFwicGVyZjpzdGFydFwiIC8qIFBFUkZPUk1BTkNFX1NUQVJUICovXG4pO1xuY29uc3QgZGV2dG9vbHNQZXJmRW5kID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZURldnRvb2xzUGVyZm9ybWFuY2VIb29rKFxuICBcInBlcmY6ZW5kXCIgLyogUEVSRk9STUFOQ0VfRU5EICovXG4pO1xuZnVuY3Rpb24gY3JlYXRlRGV2dG9vbHNQZXJmb3JtYW5jZUhvb2soaG9vaykge1xuICByZXR1cm4gKGNvbXBvbmVudCwgdHlwZSwgdGltZSkgPT4ge1xuICAgIGVtaXQkMShob29rLCBjb21wb25lbnQuYXBwQ29udGV4dC5hcHAsIGNvbXBvbmVudC51aWQsIGNvbXBvbmVudCwgdHlwZSwgdGltZSk7XG4gIH07XG59XG5mdW5jdGlvbiBkZXZ0b29sc0NvbXBvbmVudEVtaXQoY29tcG9uZW50LCBldmVudCwgcGFyYW1zKSB7XG4gIGVtaXQkMShcbiAgICBcImNvbXBvbmVudDplbWl0XCIgLyogQ09NUE9ORU5UX0VNSVQgKi8sXG4gICAgY29tcG9uZW50LmFwcENvbnRleHQuYXBwLFxuICAgIGNvbXBvbmVudCxcbiAgICBldmVudCxcbiAgICBwYXJhbXNcbiAgKTtcbn1cblxuZnVuY3Rpb24gZW1pdChpbnN0YW5jZSwgZXZlbnQsIC4uLnJhd0FyZ3MpIHtcbiAgaWYgKGluc3RhbmNlLmlzVW5tb3VudGVkKVxuICAgIHJldHVybjtcbiAgY29uc3QgcHJvcHMgPSBpbnN0YW5jZS52bm9kZS5wcm9wcyB8fCBFTVBUWV9PQko7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgY29uc3Qge1xuICAgICAgZW1pdHNPcHRpb25zLFxuICAgICAgcHJvcHNPcHRpb25zOiBbcHJvcHNPcHRpb25zXVxuICAgIH0gPSBpbnN0YW5jZTtcbiAgICBpZiAoZW1pdHNPcHRpb25zKSB7XG4gICAgICBpZiAoIShldmVudCBpbiBlbWl0c09wdGlvbnMpICYmIHRydWUpIHtcbiAgICAgICAgaWYgKCFwcm9wc09wdGlvbnMgfHwgISh0b0hhbmRsZXJLZXkoZXZlbnQpIGluIHByb3BzT3B0aW9ucykpIHtcbiAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgYENvbXBvbmVudCBlbWl0dGVkIGV2ZW50IFwiJHtldmVudH1cIiBidXQgaXQgaXMgbmVpdGhlciBkZWNsYXJlZCBpbiB0aGUgZW1pdHMgb3B0aW9uIG5vciBhcyBhbiBcIiR7dG9IYW5kbGVyS2V5KGV2ZW50KX1cIiBwcm9wLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWxpZGF0b3IgPSBlbWl0c09wdGlvbnNbZXZlbnRdO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbih2YWxpZGF0b3IpKSB7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRvciguLi5yYXdBcmdzKTtcbiAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgIGBJbnZhbGlkIGV2ZW50IGFyZ3VtZW50czogZXZlbnQgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGV2ZW50IFwiJHtldmVudH1cIi5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBsZXQgYXJncyA9IHJhd0FyZ3M7XG4gIGNvbnN0IGlzTW9kZWxMaXN0ZW5lciA9IGV2ZW50LnN0YXJ0c1dpdGgoXCJ1cGRhdGU6XCIpO1xuICBjb25zdCBtb2RlbEFyZyA9IGlzTW9kZWxMaXN0ZW5lciAmJiBldmVudC5zbGljZSg3KTtcbiAgaWYgKG1vZGVsQXJnICYmIG1vZGVsQXJnIGluIHByb3BzKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzS2V5ID0gYCR7bW9kZWxBcmcgPT09IFwibW9kZWxWYWx1ZVwiID8gXCJtb2RlbFwiIDogbW9kZWxBcmd9TW9kaWZpZXJzYDtcbiAgICBjb25zdCB7IG51bWJlciwgdHJpbSB9ID0gcHJvcHNbbW9kaWZpZXJzS2V5XSB8fCBFTVBUWV9PQko7XG4gICAgaWYgKHRyaW0pIHtcbiAgICAgIGFyZ3MgPSByYXdBcmdzLm1hcCgoYSkgPT4gaXNTdHJpbmcoYSkgPyBhLnRyaW0oKSA6IGEpO1xuICAgIH1cbiAgICBpZiAobnVtYmVyKSB7XG4gICAgICBhcmdzID0gcmF3QXJncy5tYXAobG9vc2VUb051bWJlcik7XG4gICAgfVxuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgIGRldnRvb2xzQ29tcG9uZW50RW1pdChpbnN0YW5jZSwgZXZlbnQsIGFyZ3MpO1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgY29uc3QgbG93ZXJDYXNlRXZlbnQgPSBldmVudC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsb3dlckNhc2VFdmVudCAhPT0gZXZlbnQgJiYgcHJvcHNbdG9IYW5kbGVyS2V5KGxvd2VyQ2FzZUV2ZW50KV0pIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBFdmVudCBcIiR7bG93ZXJDYXNlRXZlbnR9XCIgaXMgZW1pdHRlZCBpbiBjb21wb25lbnQgJHtmb3JtYXRDb21wb25lbnROYW1lKFxuICAgICAgICAgIGluc3RhbmNlLFxuICAgICAgICAgIGluc3RhbmNlLnR5cGVcbiAgICAgICAgKX0gYnV0IHRoZSBoYW5kbGVyIGlzIHJlZ2lzdGVyZWQgZm9yIFwiJHtldmVudH1cIi4gTm90ZSB0aGF0IEhUTUwgYXR0cmlidXRlcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZSBhbmQgeW91IGNhbm5vdCB1c2Ugdi1vbiB0byBsaXN0ZW4gdG8gY2FtZWxDYXNlIGV2ZW50cyB3aGVuIHVzaW5nIGluLURPTSB0ZW1wbGF0ZXMuIFlvdSBzaG91bGQgcHJvYmFibHkgdXNlIFwiJHtoeXBoZW5hdGUoZXZlbnQpfVwiIGluc3RlYWQgb2YgXCIke2V2ZW50fVwiLmBcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIGxldCBoYW5kbGVyTmFtZTtcbiAgbGV0IGhhbmRsZXIgPSBwcm9wc1toYW5kbGVyTmFtZSA9IHRvSGFuZGxlcktleShldmVudCldIHx8IC8vIGFsc28gdHJ5IGNhbWVsQ2FzZSBldmVudCBoYW5kbGVyICgjMjI0OSlcbiAgcHJvcHNbaGFuZGxlck5hbWUgPSB0b0hhbmRsZXJLZXkoY2FtZWxpemUoZXZlbnQpKV07XG4gIGlmICghaGFuZGxlciAmJiBpc01vZGVsTGlzdGVuZXIpIHtcbiAgICBoYW5kbGVyID0gcHJvcHNbaGFuZGxlck5hbWUgPSB0b0hhbmRsZXJLZXkoaHlwaGVuYXRlKGV2ZW50KSldO1xuICB9XG4gIGlmIChoYW5kbGVyKSB7XG4gICAgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoXG4gICAgICBoYW5kbGVyLFxuICAgICAgaW5zdGFuY2UsXG4gICAgICA2LFxuICAgICAgYXJnc1xuICAgICk7XG4gIH1cbiAgY29uc3Qgb25jZUhhbmRsZXIgPSBwcm9wc1toYW5kbGVyTmFtZSArIGBPbmNlYF07XG4gIGlmIChvbmNlSGFuZGxlcikge1xuICAgIGlmICghaW5zdGFuY2UuZW1pdHRlZCkge1xuICAgICAgaW5zdGFuY2UuZW1pdHRlZCA9IHt9O1xuICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UuZW1pdHRlZFtoYW5kbGVyTmFtZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaW5zdGFuY2UuZW1pdHRlZFtoYW5kbGVyTmFtZV0gPSB0cnVlO1xuICAgIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKFxuICAgICAgb25jZUhhbmRsZXIsXG4gICAgICBpbnN0YW5jZSxcbiAgICAgIDYsXG4gICAgICBhcmdzXG4gICAgKTtcbiAgfVxufVxuZnVuY3Rpb24gbm9ybWFsaXplRW1pdHNPcHRpb25zKGNvbXAsIGFwcENvbnRleHQsIGFzTWl4aW4gPSBmYWxzZSkge1xuICBjb25zdCBjYWNoZSA9IGFwcENvbnRleHQuZW1pdHNDYWNoZTtcbiAgY29uc3QgY2FjaGVkID0gY2FjaGUuZ2V0KGNvbXApO1xuICBpZiAoY2FjaGVkICE9PSB2b2lkIDApIHtcbiAgICByZXR1cm4gY2FjaGVkO1xuICB9XG4gIGNvbnN0IHJhdyA9IGNvbXAuZW1pdHM7XG4gIGxldCBub3JtYWxpemVkID0ge307XG4gIGxldCBoYXNFeHRlbmRzID0gZmFsc2U7XG4gIGlmIChfX1ZVRV9PUFRJT05TX0FQSV9fICYmICFpc0Z1bmN0aW9uKGNvbXApKSB7XG4gICAgY29uc3QgZXh0ZW5kRW1pdHMgPSAocmF3MikgPT4ge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZEZyb21FeHRlbmQgPSBub3JtYWxpemVFbWl0c09wdGlvbnMocmF3MiwgYXBwQ29udGV4dCwgdHJ1ZSk7XG4gICAgICBpZiAobm9ybWFsaXplZEZyb21FeHRlbmQpIHtcbiAgICAgICAgaGFzRXh0ZW5kcyA9IHRydWU7XG4gICAgICAgIGV4dGVuZChub3JtYWxpemVkLCBub3JtYWxpemVkRnJvbUV4dGVuZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoIWFzTWl4aW4gJiYgYXBwQ29udGV4dC5taXhpbnMubGVuZ3RoKSB7XG4gICAgICBhcHBDb250ZXh0Lm1peGlucy5mb3JFYWNoKGV4dGVuZEVtaXRzKTtcbiAgICB9XG4gICAgaWYgKGNvbXAuZXh0ZW5kcykge1xuICAgICAgZXh0ZW5kRW1pdHMoY29tcC5leHRlbmRzKTtcbiAgICB9XG4gICAgaWYgKGNvbXAubWl4aW5zKSB7XG4gICAgICBjb21wLm1peGlucy5mb3JFYWNoKGV4dGVuZEVtaXRzKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFyYXcgJiYgIWhhc0V4dGVuZHMpIHtcbiAgICBpZiAoaXNPYmplY3QoY29tcCkpIHtcbiAgICAgIGNhY2hlLnNldChjb21wLCBudWxsKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGlzQXJyYXkocmF3KSkge1xuICAgIHJhdy5mb3JFYWNoKChrZXkpID0+IG5vcm1hbGl6ZWRba2V5XSA9IG51bGwpO1xuICB9IGVsc2Uge1xuICAgIGV4dGVuZChub3JtYWxpemVkLCByYXcpO1xuICB9XG4gIGlmIChpc09iamVjdChjb21wKSkge1xuICAgIGNhY2hlLnNldChjb21wLCBub3JtYWxpemVkKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplZDtcbn1cbmZ1bmN0aW9uIGlzRW1pdExpc3RlbmVyKG9wdGlvbnMsIGtleSkge1xuICBpZiAoIW9wdGlvbnMgfHwgIWlzT24oa2V5KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBrZXkgPSBrZXkuc2xpY2UoMikucmVwbGFjZSgvT25jZSQvLCBcIlwiKTtcbiAgcmV0dXJuIGhhc093bihvcHRpb25zLCBrZXlbMF0udG9Mb3dlckNhc2UoKSArIGtleS5zbGljZSgxKSkgfHwgaGFzT3duKG9wdGlvbnMsIGh5cGhlbmF0ZShrZXkpKSB8fCBoYXNPd24ob3B0aW9ucywga2V5KTtcbn1cblxubGV0IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSA9IG51bGw7XG5sZXQgY3VycmVudFNjb3BlSWQgPSBudWxsO1xuZnVuY3Rpb24gc2V0Q3VycmVudFJlbmRlcmluZ0luc3RhbmNlKGluc3RhbmNlKSB7XG4gIGNvbnN0IHByZXYgPSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2U7XG4gIGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSA9IGluc3RhbmNlO1xuICBjdXJyZW50U2NvcGVJZCA9IGluc3RhbmNlICYmIGluc3RhbmNlLnR5cGUuX19zY29wZUlkIHx8IG51bGw7XG4gIHJldHVybiBwcmV2O1xufVxuZnVuY3Rpb24gcHVzaFNjb3BlSWQoaWQpIHtcbiAgY3VycmVudFNjb3BlSWQgPSBpZDtcbn1cbmZ1bmN0aW9uIHBvcFNjb3BlSWQoKSB7XG4gIGN1cnJlbnRTY29wZUlkID0gbnVsbDtcbn1cbmNvbnN0IHdpdGhTY29wZUlkID0gKF9pZCkgPT4gd2l0aEN0eDtcbmZ1bmN0aW9uIHdpdGhDdHgoZm4sIGN0eCA9IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSwgaXNOb25TY29wZWRTbG90KSB7XG4gIGlmICghY3R4KVxuICAgIHJldHVybiBmbjtcbiAgaWYgKGZuLl9uKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG4gIGNvbnN0IHJlbmRlckZuV2l0aENvbnRleHQgPSAoLi4uYXJncykgPT4ge1xuICAgIGlmIChyZW5kZXJGbldpdGhDb250ZXh0Ll9kKSB7XG4gICAgICBzZXRCbG9ja1RyYWNraW5nKC0xKTtcbiAgICB9XG4gICAgY29uc3QgcHJldkluc3RhbmNlID0gc2V0Q3VycmVudFJlbmRlcmluZ0luc3RhbmNlKGN0eCk7XG4gICAgbGV0IHJlcztcbiAgICB0cnkge1xuICAgICAgcmVzID0gZm4oLi4uYXJncyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldEN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZShwcmV2SW5zdGFuY2UpO1xuICAgICAgaWYgKHJlbmRlckZuV2l0aENvbnRleHQuX2QpIHtcbiAgICAgICAgc2V0QmxvY2tUcmFja2luZygxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSB7XG4gICAgICBkZXZ0b29sc0NvbXBvbmVudFVwZGF0ZWQoY3R4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbiAgcmVuZGVyRm5XaXRoQ29udGV4dC5fbiA9IHRydWU7XG4gIHJlbmRlckZuV2l0aENvbnRleHQuX2MgPSB0cnVlO1xuICByZW5kZXJGbldpdGhDb250ZXh0Ll9kID0gdHJ1ZTtcbiAgcmV0dXJuIHJlbmRlckZuV2l0aENvbnRleHQ7XG59XG5cbmxldCBhY2Nlc3NlZEF0dHJzID0gZmFsc2U7XG5mdW5jdGlvbiBtYXJrQXR0cnNBY2Nlc3NlZCgpIHtcbiAgYWNjZXNzZWRBdHRycyA9IHRydWU7XG59XG5mdW5jdGlvbiByZW5kZXJDb21wb25lbnRSb290KGluc3RhbmNlKSB7XG4gIGNvbnN0IHtcbiAgICB0eXBlOiBDb21wb25lbnQsXG4gICAgdm5vZGUsXG4gICAgcHJveHksXG4gICAgd2l0aFByb3h5LFxuICAgIHByb3BzLFxuICAgIHByb3BzT3B0aW9uczogW3Byb3BzT3B0aW9uc10sXG4gICAgc2xvdHMsXG4gICAgYXR0cnMsXG4gICAgZW1pdCxcbiAgICByZW5kZXIsXG4gICAgcmVuZGVyQ2FjaGUsXG4gICAgZGF0YSxcbiAgICBzZXR1cFN0YXRlLFxuICAgIGN0eCxcbiAgICBpbmhlcml0QXR0cnNcbiAgfSA9IGluc3RhbmNlO1xuICBsZXQgcmVzdWx0O1xuICBsZXQgZmFsbHRocm91Z2hBdHRycztcbiAgY29uc3QgcHJldiA9IHNldEN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZShpbnN0YW5jZSk7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgYWNjZXNzZWRBdHRycyA9IGZhbHNlO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDQpIHtcbiAgICAgIGNvbnN0IHByb3h5VG9Vc2UgPSB3aXRoUHJveHkgfHwgcHJveHk7XG4gICAgICByZXN1bHQgPSBub3JtYWxpemVWTm9kZShcbiAgICAgICAgcmVuZGVyLmNhbGwoXG4gICAgICAgICAgcHJveHlUb1VzZSxcbiAgICAgICAgICBwcm94eVRvVXNlLFxuICAgICAgICAgIHJlbmRlckNhY2hlLFxuICAgICAgICAgIHByb3BzLFxuICAgICAgICAgIHNldHVwU3RhdGUsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBjdHhcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICAgIGZhbGx0aHJvdWdoQXR0cnMgPSBhdHRycztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVuZGVyMiA9IENvbXBvbmVudDtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGF0dHJzID09PSBwcm9wcykge1xuICAgICAgICBtYXJrQXR0cnNBY2Nlc3NlZCgpO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gbm9ybWFsaXplVk5vZGUoXG4gICAgICAgIHJlbmRlcjIubGVuZ3RoID4gMSA/IHJlbmRlcjIoXG4gICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHtcbiAgICAgICAgICAgIGdldCBhdHRycygpIHtcbiAgICAgICAgICAgICAgbWFya0F0dHJzQWNjZXNzZWQoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNsb3RzLFxuICAgICAgICAgICAgZW1pdFxuICAgICAgICAgIH0gOiB7IGF0dHJzLCBzbG90cywgZW1pdCB9XG4gICAgICAgICkgOiByZW5kZXIyKFxuICAgICAgICAgIHByb3BzLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgICAvKiB3ZSBrbm93IGl0IGRvZXNuJ3QgbmVlZCBpdCAqL1xuICAgICAgICApXG4gICAgICApO1xuICAgICAgZmFsbHRocm91Z2hBdHRycyA9IENvbXBvbmVudC5wcm9wcyA/IGF0dHJzIDogZ2V0RnVuY3Rpb25hbEZhbGx0aHJvdWdoKGF0dHJzKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGJsb2NrU3RhY2subGVuZ3RoID0gMDtcbiAgICBoYW5kbGVFcnJvcihlcnIsIGluc3RhbmNlLCAxKTtcbiAgICByZXN1bHQgPSBjcmVhdGVWTm9kZShDb21tZW50KTtcbiAgfVxuICBsZXQgcm9vdCA9IHJlc3VsdDtcbiAgbGV0IHNldFJvb3QgPSB2b2lkIDA7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHJlc3VsdC5wYXRjaEZsYWcgPiAwICYmIHJlc3VsdC5wYXRjaEZsYWcgJiAyMDQ4KSB7XG4gICAgW3Jvb3QsIHNldFJvb3RdID0gZ2V0Q2hpbGRSb290KHJlc3VsdCk7XG4gIH1cbiAgaWYgKGZhbGx0aHJvdWdoQXR0cnMgJiYgaW5oZXJpdEF0dHJzICE9PSBmYWxzZSkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhmYWxsdGhyb3VnaEF0dHJzKTtcbiAgICBjb25zdCB7IHNoYXBlRmxhZyB9ID0gcm9vdDtcbiAgICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICAgIGlmIChzaGFwZUZsYWcgJiAoMSB8IDYpKSB7XG4gICAgICAgIGlmIChwcm9wc09wdGlvbnMgJiYga2V5cy5zb21lKGlzTW9kZWxMaXN0ZW5lcikpIHtcbiAgICAgICAgICBmYWxsdGhyb3VnaEF0dHJzID0gZmlsdGVyTW9kZWxMaXN0ZW5lcnMoXG4gICAgICAgICAgICBmYWxsdGhyb3VnaEF0dHJzLFxuICAgICAgICAgICAgcHJvcHNPcHRpb25zXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByb290ID0gY2xvbmVWTm9kZShyb290LCBmYWxsdGhyb3VnaEF0dHJzKTtcbiAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhYWNjZXNzZWRBdHRycyAmJiByb290LnR5cGUgIT09IENvbW1lbnQpIHtcbiAgICAgICAgY29uc3QgYWxsQXR0cnMgPSBPYmplY3Qua2V5cyhhdHRycyk7XG4gICAgICAgIGNvbnN0IGV2ZW50QXR0cnMgPSBbXTtcbiAgICAgICAgY29uc3QgZXh0cmFBdHRycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGFsbEF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGFsbEF0dHJzW2ldO1xuICAgICAgICAgIGlmIChpc09uKGtleSkpIHtcbiAgICAgICAgICAgIGlmICghaXNNb2RlbExpc3RlbmVyKGtleSkpIHtcbiAgICAgICAgICAgICAgZXZlbnRBdHRycy5wdXNoKGtleVsyXS50b0xvd2VyQ2FzZSgpICsga2V5LnNsaWNlKDMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXh0cmFBdHRycy5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChleHRyYUF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICBgRXh0cmFuZW91cyBub24tcHJvcHMgYXR0cmlidXRlcyAoJHtleHRyYUF0dHJzLmpvaW4oXCIsIFwiKX0pIHdlcmUgcGFzc2VkIHRvIGNvbXBvbmVudCBidXQgY291bGQgbm90IGJlIGF1dG9tYXRpY2FsbHkgaW5oZXJpdGVkIGJlY2F1c2UgY29tcG9uZW50IHJlbmRlcnMgZnJhZ21lbnQgb3IgdGV4dCByb290IG5vZGVzLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudEF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICBgRXh0cmFuZW91cyBub24tZW1pdHMgZXZlbnQgbGlzdGVuZXJzICgke2V2ZW50QXR0cnMuam9pbihcIiwgXCIpfSkgd2VyZSBwYXNzZWQgdG8gY29tcG9uZW50IGJ1dCBjb3VsZCBub3QgYmUgYXV0b21hdGljYWxseSBpbmhlcml0ZWQgYmVjYXVzZSBjb21wb25lbnQgcmVuZGVycyBmcmFnbWVudCBvciB0ZXh0IHJvb3Qgbm9kZXMuIElmIHRoZSBsaXN0ZW5lciBpcyBpbnRlbmRlZCB0byBiZSBhIGNvbXBvbmVudCBjdXN0b20gZXZlbnQgbGlzdGVuZXIgb25seSwgZGVjbGFyZSBpdCB1c2luZyB0aGUgXCJlbWl0c1wiIG9wdGlvbi5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodm5vZGUuZGlycykge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFpc0VsZW1lbnRSb290KHJvb3QpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgUnVudGltZSBkaXJlY3RpdmUgdXNlZCBvbiBjb21wb25lbnQgd2l0aCBub24tZWxlbWVudCByb290IG5vZGUuIFRoZSBkaXJlY3RpdmVzIHdpbGwgbm90IGZ1bmN0aW9uIGFzIGludGVuZGVkLmBcbiAgICAgICk7XG4gICAgfVxuICAgIHJvb3QgPSBjbG9uZVZOb2RlKHJvb3QpO1xuICAgIHJvb3QuZGlycyA9IHJvb3QuZGlycyA/IHJvb3QuZGlycy5jb25jYXQodm5vZGUuZGlycykgOiB2bm9kZS5kaXJzO1xuICB9XG4gIGlmICh2bm9kZS50cmFuc2l0aW9uKSB7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWlzRWxlbWVudFJvb3Qocm9vdCkpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBDb21wb25lbnQgaW5zaWRlIDxUcmFuc2l0aW9uPiByZW5kZXJzIG5vbi1lbGVtZW50IHJvb3Qgbm9kZSB0aGF0IGNhbm5vdCBiZSBhbmltYXRlZC5gXG4gICAgICApO1xuICAgIH1cbiAgICByb290LnRyYW5zaXRpb24gPSB2bm9kZS50cmFuc2l0aW9uO1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHNldFJvb3QpIHtcbiAgICBzZXRSb290KHJvb3QpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHJvb3Q7XG4gIH1cbiAgc2V0Q3VycmVudFJlbmRlcmluZ0luc3RhbmNlKHByZXYpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuY29uc3QgZ2V0Q2hpbGRSb290ID0gKHZub2RlKSA9PiB7XG4gIGNvbnN0IHJhd0NoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gIGNvbnN0IGR5bmFtaWNDaGlsZHJlbiA9IHZub2RlLmR5bmFtaWNDaGlsZHJlbjtcbiAgY29uc3QgY2hpbGRSb290ID0gZmlsdGVyU2luZ2xlUm9vdChyYXdDaGlsZHJlbik7XG4gIGlmICghY2hpbGRSb290KSB7XG4gICAgcmV0dXJuIFt2bm9kZSwgdm9pZCAwXTtcbiAgfVxuICBjb25zdCBpbmRleCA9IHJhd0NoaWxkcmVuLmluZGV4T2YoY2hpbGRSb290KTtcbiAgY29uc3QgZHluYW1pY0luZGV4ID0gZHluYW1pY0NoaWxkcmVuID8gZHluYW1pY0NoaWxkcmVuLmluZGV4T2YoY2hpbGRSb290KSA6IC0xO1xuICBjb25zdCBzZXRSb290ID0gKHVwZGF0ZWRSb290KSA9PiB7XG4gICAgcmF3Q2hpbGRyZW5baW5kZXhdID0gdXBkYXRlZFJvb3Q7XG4gICAgaWYgKGR5bmFtaWNDaGlsZHJlbikge1xuICAgICAgaWYgKGR5bmFtaWNJbmRleCA+IC0xKSB7XG4gICAgICAgIGR5bmFtaWNDaGlsZHJlbltkeW5hbWljSW5kZXhdID0gdXBkYXRlZFJvb3Q7XG4gICAgICB9IGVsc2UgaWYgKHVwZGF0ZWRSb290LnBhdGNoRmxhZyA+IDApIHtcbiAgICAgICAgdm5vZGUuZHluYW1pY0NoaWxkcmVuID0gWy4uLmR5bmFtaWNDaGlsZHJlbiwgdXBkYXRlZFJvb3RdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIFtub3JtYWxpemVWTm9kZShjaGlsZFJvb3QpLCBzZXRSb290XTtcbn07XG5mdW5jdGlvbiBmaWx0ZXJTaW5nbGVSb290KGNoaWxkcmVuKSB7XG4gIGxldCBzaW5nbGVSb290O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICBpZiAoaXNWTm9kZShjaGlsZCkpIHtcbiAgICAgIGlmIChjaGlsZC50eXBlICE9PSBDb21tZW50IHx8IGNoaWxkLmNoaWxkcmVuID09PSBcInYtaWZcIikge1xuICAgICAgICBpZiAoc2luZ2xlUm9vdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaW5nbGVSb290ID0gY2hpbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2luZ2xlUm9vdDtcbn1cbmNvbnN0IGdldEZ1bmN0aW9uYWxGYWxsdGhyb3VnaCA9IChhdHRycykgPT4ge1xuICBsZXQgcmVzO1xuICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycykge1xuICAgIGlmIChrZXkgPT09IFwiY2xhc3NcIiB8fCBrZXkgPT09IFwic3R5bGVcIiB8fCBpc09uKGtleSkpIHtcbiAgICAgIChyZXMgfHwgKHJlcyA9IHt9KSlba2V5XSA9IGF0dHJzW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59O1xuY29uc3QgZmlsdGVyTW9kZWxMaXN0ZW5lcnMgPSAoYXR0cnMsIHByb3BzKSA9PiB7XG4gIGNvbnN0IHJlcyA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBpbiBhdHRycykge1xuICAgIGlmICghaXNNb2RlbExpc3RlbmVyKGtleSkgfHwgIShrZXkuc2xpY2UoOSkgaW4gcHJvcHMpKSB7XG4gICAgICByZXNba2V5XSA9IGF0dHJzW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59O1xuY29uc3QgaXNFbGVtZW50Um9vdCA9ICh2bm9kZSkgPT4ge1xuICByZXR1cm4gdm5vZGUuc2hhcGVGbGFnICYgKDYgfCAxKSB8fCB2bm9kZS50eXBlID09PSBDb21tZW50O1xufTtcbmZ1bmN0aW9uIHNob3VsZFVwZGF0ZUNvbXBvbmVudChwcmV2Vk5vZGUsIG5leHRWTm9kZSwgb3B0aW1pemVkKSB7XG4gIGNvbnN0IHsgcHJvcHM6IHByZXZQcm9wcywgY2hpbGRyZW46IHByZXZDaGlsZHJlbiwgY29tcG9uZW50IH0gPSBwcmV2Vk5vZGU7XG4gIGNvbnN0IHsgcHJvcHM6IG5leHRQcm9wcywgY2hpbGRyZW46IG5leHRDaGlsZHJlbiwgcGF0Y2hGbGFnIH0gPSBuZXh0Vk5vZGU7XG4gIGNvbnN0IGVtaXRzID0gY29tcG9uZW50LmVtaXRzT3B0aW9ucztcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgKHByZXZDaGlsZHJlbiB8fCBuZXh0Q2hpbGRyZW4pICYmIGlzSG1yVXBkYXRpbmcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAobmV4dFZOb2RlLmRpcnMgfHwgbmV4dFZOb2RlLnRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAob3B0aW1pemVkICYmIHBhdGNoRmxhZyA+PSAwKSB7XG4gICAgaWYgKHBhdGNoRmxhZyAmIDEwMjQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAocGF0Y2hGbGFnICYgMTYpIHtcbiAgICAgIGlmICghcHJldlByb3BzKSB7XG4gICAgICAgIHJldHVybiAhIW5leHRQcm9wcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXNQcm9wc0NoYW5nZWQocHJldlByb3BzLCBuZXh0UHJvcHMsIGVtaXRzKTtcbiAgICB9IGVsc2UgaWYgKHBhdGNoRmxhZyAmIDgpIHtcbiAgICAgIGNvbnN0IGR5bmFtaWNQcm9wcyA9IG5leHRWTm9kZS5keW5hbWljUHJvcHM7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGR5bmFtaWNQcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBkeW5hbWljUHJvcHNbaV07XG4gICAgICAgIGlmIChuZXh0UHJvcHNba2V5XSAhPT0gcHJldlByb3BzW2tleV0gJiYgIWlzRW1pdExpc3RlbmVyKGVtaXRzLCBrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHByZXZDaGlsZHJlbiB8fCBuZXh0Q2hpbGRyZW4pIHtcbiAgICAgIGlmICghbmV4dENoaWxkcmVuIHx8ICFuZXh0Q2hpbGRyZW4uJHN0YWJsZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXZQcm9wcyA9PT0gbmV4dFByb3BzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcHJldlByb3BzKSB7XG4gICAgICByZXR1cm4gISFuZXh0UHJvcHM7XG4gICAgfVxuICAgIGlmICghbmV4dFByb3BzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc1Byb3BzQ2hhbmdlZChwcmV2UHJvcHMsIG5leHRQcm9wcywgZW1pdHMpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGhhc1Byb3BzQ2hhbmdlZChwcmV2UHJvcHMsIG5leHRQcm9wcywgZW1pdHNPcHRpb25zKSB7XG4gIGNvbnN0IG5leHRLZXlzID0gT2JqZWN0LmtleXMobmV4dFByb3BzKTtcbiAgaWYgKG5leHRLZXlzLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMocHJldlByb3BzKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5leHRLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gbmV4dEtleXNbaV07XG4gICAgaWYgKG5leHRQcm9wc1trZXldICE9PSBwcmV2UHJvcHNba2V5XSAmJiAhaXNFbWl0TGlzdGVuZXIoZW1pdHNPcHRpb25zLCBrZXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gdXBkYXRlSE9DSG9zdEVsKHsgdm5vZGUsIHBhcmVudCB9LCBlbCkge1xuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudC5zdWJUcmVlID09PSB2bm9kZSkge1xuICAgICh2bm9kZSA9IHBhcmVudC52bm9kZSkuZWwgPSBlbDtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbmNvbnN0IGlzU3VzcGVuc2UgPSAodHlwZSkgPT4gdHlwZS5fX2lzU3VzcGVuc2U7XG5jb25zdCBTdXNwZW5zZUltcGwgPSB7XG4gIG5hbWU6IFwiU3VzcGVuc2VcIixcbiAgLy8gSW4gb3JkZXIgdG8gbWFrZSBTdXNwZW5zZSB0cmVlLXNoYWthYmxlLCB3ZSBuZWVkIHRvIGF2b2lkIGltcG9ydGluZyBpdFxuICAvLyBkaXJlY3RseSBpbiB0aGUgcmVuZGVyZXIuIFRoZSByZW5kZXJlciBjaGVja3MgZm9yIHRoZSBfX2lzU3VzcGVuc2UgZmxhZ1xuICAvLyBvbiBhIHZub2RlJ3MgdHlwZSBhbmQgY2FsbHMgdGhlIGBwcm9jZXNzYCBtZXRob2QsIHBhc3NpbmcgaW4gcmVuZGVyZXJcbiAgLy8gaW50ZXJuYWxzLlxuICBfX2lzU3VzcGVuc2U6IHRydWUsXG4gIHByb2Nlc3MobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkLCByZW5kZXJlckludGVybmFscykge1xuICAgIGlmIChuMSA9PSBudWxsKSB7XG4gICAgICBtb3VudFN1c3BlbnNlKFxuICAgICAgICBuMixcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBhbmNob3IsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgIGlzU1ZHLFxuICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgIG9wdGltaXplZCxcbiAgICAgICAgcmVuZGVyZXJJbnRlcm5hbHNcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGNoU3VzcGVuc2UoXG4gICAgICAgIG4xLFxuICAgICAgICBuMixcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBhbmNob3IsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkLFxuICAgICAgICByZW5kZXJlckludGVybmFsc1xuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIGh5ZHJhdGU6IGh5ZHJhdGVTdXNwZW5zZSxcbiAgY3JlYXRlOiBjcmVhdGVTdXNwZW5zZUJvdW5kYXJ5LFxuICBub3JtYWxpemU6IG5vcm1hbGl6ZVN1c3BlbnNlQ2hpbGRyZW5cbn07XG5jb25zdCBTdXNwZW5zZSA9IFN1c3BlbnNlSW1wbCA7XG5mdW5jdGlvbiB0cmlnZ2VyRXZlbnQodm5vZGUsIG5hbWUpIHtcbiAgY29uc3QgZXZlbnRMaXN0ZW5lciA9IHZub2RlLnByb3BzICYmIHZub2RlLnByb3BzW25hbWVdO1xuICBpZiAoaXNGdW5jdGlvbihldmVudExpc3RlbmVyKSkge1xuICAgIGV2ZW50TGlzdGVuZXIoKTtcbiAgfVxufVxuZnVuY3Rpb24gbW91bnRTdXNwZW5zZSh2bm9kZSwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMpIHtcbiAgY29uc3Qge1xuICAgIHA6IHBhdGNoLFxuICAgIG86IHsgY3JlYXRlRWxlbWVudCB9XG4gIH0gPSByZW5kZXJlckludGVybmFscztcbiAgY29uc3QgaGlkZGVuQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29uc3Qgc3VzcGVuc2UgPSB2bm9kZS5zdXNwZW5zZSA9IGNyZWF0ZVN1c3BlbnNlQm91bmRhcnkoXG4gICAgdm5vZGUsXG4gICAgcGFyZW50U3VzcGVuc2UsXG4gICAgcGFyZW50Q29tcG9uZW50LFxuICAgIGNvbnRhaW5lcixcbiAgICBoaWRkZW5Db250YWluZXIsXG4gICAgYW5jaG9yLFxuICAgIGlzU1ZHLFxuICAgIHNsb3RTY29wZUlkcyxcbiAgICBvcHRpbWl6ZWQsXG4gICAgcmVuZGVyZXJJbnRlcm5hbHNcbiAgKTtcbiAgcGF0Y2goXG4gICAgbnVsbCxcbiAgICBzdXNwZW5zZS5wZW5kaW5nQnJhbmNoID0gdm5vZGUuc3NDb250ZW50LFxuICAgIGhpZGRlbkNvbnRhaW5lcixcbiAgICBudWxsLFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgICBzdXNwZW5zZSxcbiAgICBpc1NWRyxcbiAgICBzbG90U2NvcGVJZHNcbiAgKTtcbiAgaWYgKHN1c3BlbnNlLmRlcHMgPiAwKSB7XG4gICAgdHJpZ2dlckV2ZW50KHZub2RlLCBcIm9uUGVuZGluZ1wiKTtcbiAgICB0cmlnZ2VyRXZlbnQodm5vZGUsIFwib25GYWxsYmFja1wiKTtcbiAgICBwYXRjaChcbiAgICAgIG51bGwsXG4gICAgICB2bm9kZS5zc0ZhbGxiYWNrLFxuICAgICAgY29udGFpbmVyLFxuICAgICAgYW5jaG9yLFxuICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgbnVsbCxcbiAgICAgIC8vIGZhbGxiYWNrIHRyZWUgd2lsbCBub3QgaGF2ZSBzdXNwZW5zZSBjb250ZXh0XG4gICAgICBpc1NWRyxcbiAgICAgIHNsb3RTY29wZUlkc1xuICAgICk7XG4gICAgc2V0QWN0aXZlQnJhbmNoKHN1c3BlbnNlLCB2bm9kZS5zc0ZhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBzdXNwZW5zZS5yZXNvbHZlKGZhbHNlLCB0cnVlKTtcbiAgfVxufVxuZnVuY3Rpb24gcGF0Y2hTdXNwZW5zZShuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCwgeyBwOiBwYXRjaCwgdW06IHVubW91bnQsIG86IHsgY3JlYXRlRWxlbWVudCB9IH0pIHtcbiAgY29uc3Qgc3VzcGVuc2UgPSBuMi5zdXNwZW5zZSA9IG4xLnN1c3BlbnNlO1xuICBzdXNwZW5zZS52bm9kZSA9IG4yO1xuICBuMi5lbCA9IG4xLmVsO1xuICBjb25zdCBuZXdCcmFuY2ggPSBuMi5zc0NvbnRlbnQ7XG4gIGNvbnN0IG5ld0ZhbGxiYWNrID0gbjIuc3NGYWxsYmFjaztcbiAgY29uc3QgeyBhY3RpdmVCcmFuY2gsIHBlbmRpbmdCcmFuY2gsIGlzSW5GYWxsYmFjaywgaXNIeWRyYXRpbmcgfSA9IHN1c3BlbnNlO1xuICBpZiAocGVuZGluZ0JyYW5jaCkge1xuICAgIHN1c3BlbnNlLnBlbmRpbmdCcmFuY2ggPSBuZXdCcmFuY2g7XG4gICAgaWYgKGlzU2FtZVZOb2RlVHlwZShuZXdCcmFuY2gsIHBlbmRpbmdCcmFuY2gpKSB7XG4gICAgICBwYXRjaChcbiAgICAgICAgcGVuZGluZ0JyYW5jaCxcbiAgICAgICAgbmV3QnJhbmNoLFxuICAgICAgICBzdXNwZW5zZS5oaWRkZW5Db250YWluZXIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgc3VzcGVuc2UsXG4gICAgICAgIGlzU1ZHLFxuICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgIG9wdGltaXplZFxuICAgICAgKTtcbiAgICAgIGlmIChzdXNwZW5zZS5kZXBzIDw9IDApIHtcbiAgICAgICAgc3VzcGVuc2UucmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIGlmIChpc0luRmFsbGJhY2spIHtcbiAgICAgICAgcGF0Y2goXG4gICAgICAgICAgYWN0aXZlQnJhbmNoLFxuICAgICAgICAgIG5ld0ZhbGxiYWNrLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgLy8gZmFsbGJhY2sgdHJlZSB3aWxsIG5vdCBoYXZlIHN1c3BlbnNlIGNvbnRleHRcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICAgIHNldEFjdGl2ZUJyYW5jaChzdXNwZW5zZSwgbmV3RmFsbGJhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdXNwZW5zZS5wZW5kaW5nSWQrKztcbiAgICAgIGlmIChpc0h5ZHJhdGluZykge1xuICAgICAgICBzdXNwZW5zZS5pc0h5ZHJhdGluZyA9IGZhbHNlO1xuICAgICAgICBzdXNwZW5zZS5hY3RpdmVCcmFuY2ggPSBwZW5kaW5nQnJhbmNoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5tb3VudChwZW5kaW5nQnJhbmNoLCBwYXJlbnRDb21wb25lbnQsIHN1c3BlbnNlKTtcbiAgICAgIH1cbiAgICAgIHN1c3BlbnNlLmRlcHMgPSAwO1xuICAgICAgc3VzcGVuc2UuZWZmZWN0cy5sZW5ndGggPSAwO1xuICAgICAgc3VzcGVuc2UuaGlkZGVuQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGlmIChpc0luRmFsbGJhY2spIHtcbiAgICAgICAgcGF0Y2goXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBuZXdCcmFuY2gsXG4gICAgICAgICAgc3VzcGVuc2UuaGlkZGVuQ29udGFpbmVyLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHN1c3BlbnNlLmRlcHMgPD0gMCkge1xuICAgICAgICAgIHN1c3BlbnNlLnJlc29sdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRjaChcbiAgICAgICAgICAgIGFjdGl2ZUJyYW5jaCxcbiAgICAgICAgICAgIG5ld0ZhbGxiYWNrLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgYW5jaG9yLFxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIC8vIGZhbGxiYWNrIHRyZWUgd2lsbCBub3QgaGF2ZSBzdXNwZW5zZSBjb250ZXh0XG4gICAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICAgICk7XG4gICAgICAgICAgc2V0QWN0aXZlQnJhbmNoKHN1c3BlbnNlLCBuZXdGYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYWN0aXZlQnJhbmNoICYmIGlzU2FtZVZOb2RlVHlwZShuZXdCcmFuY2gsIGFjdGl2ZUJyYW5jaCkpIHtcbiAgICAgICAgcGF0Y2goXG4gICAgICAgICAgYWN0aXZlQnJhbmNoLFxuICAgICAgICAgIG5ld0JyYW5jaCxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgYW5jaG9yLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBzdXNwZW5zZSxcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICAgIHN1c3BlbnNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXRjaChcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIG5ld0JyYW5jaCxcbiAgICAgICAgICBzdXNwZW5zZS5oaWRkZW5Db250YWluZXIsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgc3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICApO1xuICAgICAgICBpZiAoc3VzcGVuc2UuZGVwcyA8PSAwKSB7XG4gICAgICAgICAgc3VzcGVuc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhY3RpdmVCcmFuY2ggJiYgaXNTYW1lVk5vZGVUeXBlKG5ld0JyYW5jaCwgYWN0aXZlQnJhbmNoKSkge1xuICAgICAgcGF0Y2goXG4gICAgICAgIGFjdGl2ZUJyYW5jaCxcbiAgICAgICAgbmV3QnJhbmNoLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBzdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkXG4gICAgICApO1xuICAgICAgc2V0QWN0aXZlQnJhbmNoKHN1c3BlbnNlLCBuZXdCcmFuY2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlnZ2VyRXZlbnQobjIsIFwib25QZW5kaW5nXCIpO1xuICAgICAgc3VzcGVuc2UucGVuZGluZ0JyYW5jaCA9IG5ld0JyYW5jaDtcbiAgICAgIHN1c3BlbnNlLnBlbmRpbmdJZCsrO1xuICAgICAgcGF0Y2goXG4gICAgICAgIG51bGwsXG4gICAgICAgIG5ld0JyYW5jaCxcbiAgICAgICAgc3VzcGVuc2UuaGlkZGVuQ29udGFpbmVyLFxuICAgICAgICBudWxsLFxuICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgIHN1c3BlbnNlLFxuICAgICAgICBpc1NWRyxcbiAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICk7XG4gICAgICBpZiAoc3VzcGVuc2UuZGVwcyA8PSAwKSB7XG4gICAgICAgIHN1c3BlbnNlLnJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgdGltZW91dCwgcGVuZGluZ0lkIH0gPSBzdXNwZW5zZTtcbiAgICAgICAgaWYgKHRpbWVvdXQgPiAwKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoc3VzcGVuc2UucGVuZGluZ0lkID09PSBwZW5kaW5nSWQpIHtcbiAgICAgICAgICAgICAgc3VzcGVuc2UuZmFsbGJhY2sobmV3RmFsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWVvdXQgPT09IDApIHtcbiAgICAgICAgICBzdXNwZW5zZS5mYWxsYmFjayhuZXdGYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmxldCBoYXNXYXJuZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIGNyZWF0ZVN1c3BlbnNlQm91bmRhcnkodm5vZGUsIHBhcmVudFN1c3BlbnNlLCBwYXJlbnRDb21wb25lbnQsIGNvbnRhaW5lciwgaGlkZGVuQ29udGFpbmVyLCBhbmNob3IsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCwgcmVuZGVyZXJJbnRlcm5hbHMsIGlzSHlkcmF0aW5nID0gZmFsc2UpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgdHJ1ZSAmJiAhaGFzV2FybmVkKSB7XG4gICAgaGFzV2FybmVkID0gdHJ1ZTtcbiAgICBjb25zb2xlW2NvbnNvbGUuaW5mbyA/IFwiaW5mb1wiIDogXCJsb2dcIl0oXG4gICAgICBgPFN1c3BlbnNlPiBpcyBhbiBleHBlcmltZW50YWwgZmVhdHVyZSBhbmQgaXRzIEFQSSB3aWxsIGxpa2VseSBjaGFuZ2UuYFxuICAgICk7XG4gIH1cbiAgY29uc3Qge1xuICAgIHA6IHBhdGNoLFxuICAgIG06IG1vdmUsXG4gICAgdW06IHVubW91bnQsXG4gICAgbjogbmV4dCxcbiAgICBvOiB7IHBhcmVudE5vZGUsIHJlbW92ZSB9XG4gIH0gPSByZW5kZXJlckludGVybmFscztcbiAgbGV0IHBhcmVudFN1c3BlbnNlSWQ7XG4gIGNvbnN0IGlzU3VzcGVuc2libGUgPSBpc1ZOb2RlU3VzcGVuc2libGUodm5vZGUpO1xuICBpZiAoaXNTdXNwZW5zaWJsZSkge1xuICAgIGlmIChwYXJlbnRTdXNwZW5zZSA9PSBudWxsID8gdm9pZCAwIDogcGFyZW50U3VzcGVuc2UucGVuZGluZ0JyYW5jaCkge1xuICAgICAgcGFyZW50U3VzcGVuc2VJZCA9IHBhcmVudFN1c3BlbnNlLnBlbmRpbmdJZDtcbiAgICAgIHBhcmVudFN1c3BlbnNlLmRlcHMrKztcbiAgICB9XG4gIH1cbiAgY29uc3QgdGltZW91dCA9IHZub2RlLnByb3BzID8gdG9OdW1iZXIodm5vZGUucHJvcHMudGltZW91dCkgOiB2b2lkIDA7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgYXNzZXJ0TnVtYmVyKHRpbWVvdXQsIGBTdXNwZW5zZSB0aW1lb3V0YCk7XG4gIH1cbiAgY29uc3Qgc3VzcGVuc2UgPSB7XG4gICAgdm5vZGUsXG4gICAgcGFyZW50OiBwYXJlbnRTdXNwZW5zZSxcbiAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgaXNTVkcsXG4gICAgY29udGFpbmVyLFxuICAgIGhpZGRlbkNvbnRhaW5lcixcbiAgICBhbmNob3IsXG4gICAgZGVwczogMCxcbiAgICBwZW5kaW5nSWQ6IDAsXG4gICAgdGltZW91dDogdHlwZW9mIHRpbWVvdXQgPT09IFwibnVtYmVyXCIgPyB0aW1lb3V0IDogLTEsXG4gICAgYWN0aXZlQnJhbmNoOiBudWxsLFxuICAgIHBlbmRpbmdCcmFuY2g6IG51bGwsXG4gICAgaXNJbkZhbGxiYWNrOiB0cnVlLFxuICAgIGlzSHlkcmF0aW5nLFxuICAgIGlzVW5tb3VudGVkOiBmYWxzZSxcbiAgICBlZmZlY3RzOiBbXSxcbiAgICByZXNvbHZlKHJlc3VtZSA9IGZhbHNlLCBzeW5jID0gZmFsc2UpIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIGlmICghcmVzdW1lICYmICFzdXNwZW5zZS5wZW5kaW5nQnJhbmNoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYHN1c3BlbnNlLnJlc29sdmUoKSBpcyBjYWxsZWQgd2l0aG91dCBhIHBlbmRpbmcgYnJhbmNoLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdXNwZW5zZS5pc1VubW91bnRlZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBzdXNwZW5zZS5yZXNvbHZlKCkgaXMgY2FsbGVkIG9uIGFuIGFscmVhZHkgdW5tb3VudGVkIHN1c3BlbnNlIGJvdW5kYXJ5LmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB7XG4gICAgICAgIHZub2RlOiB2bm9kZTIsXG4gICAgICAgIGFjdGl2ZUJyYW5jaCxcbiAgICAgICAgcGVuZGluZ0JyYW5jaCxcbiAgICAgICAgcGVuZGluZ0lkLFxuICAgICAgICBlZmZlY3RzLFxuICAgICAgICBwYXJlbnRDb21wb25lbnQ6IHBhcmVudENvbXBvbmVudDIsXG4gICAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyMlxuICAgICAgfSA9IHN1c3BlbnNlO1xuICAgICAgaWYgKHN1c3BlbnNlLmlzSHlkcmF0aW5nKSB7XG4gICAgICAgIHN1c3BlbnNlLmlzSHlkcmF0aW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCFyZXN1bWUpIHtcbiAgICAgICAgY29uc3QgZGVsYXlFbnRlciA9IGFjdGl2ZUJyYW5jaCAmJiBwZW5kaW5nQnJhbmNoLnRyYW5zaXRpb24gJiYgcGVuZGluZ0JyYW5jaC50cmFuc2l0aW9uLm1vZGUgPT09IFwib3V0LWluXCI7XG4gICAgICAgIGlmIChkZWxheUVudGVyKSB7XG4gICAgICAgICAgYWN0aXZlQnJhbmNoLnRyYW5zaXRpb24uYWZ0ZXJMZWF2ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nSWQgPT09IHN1c3BlbnNlLnBlbmRpbmdJZCkge1xuICAgICAgICAgICAgICBtb3ZlKHBlbmRpbmdCcmFuY2gsIGNvbnRhaW5lcjIsIGFuY2hvcjIsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHsgYW5jaG9yOiBhbmNob3IyIH0gPSBzdXNwZW5zZTtcbiAgICAgICAgaWYgKGFjdGl2ZUJyYW5jaCkge1xuICAgICAgICAgIGFuY2hvcjIgPSBuZXh0KGFjdGl2ZUJyYW5jaCk7XG4gICAgICAgICAgdW5tb3VudChhY3RpdmVCcmFuY2gsIHBhcmVudENvbXBvbmVudDIsIHN1c3BlbnNlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlbGF5RW50ZXIpIHtcbiAgICAgICAgICBtb3ZlKHBlbmRpbmdCcmFuY2gsIGNvbnRhaW5lcjIsIGFuY2hvcjIsIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRBY3RpdmVCcmFuY2goc3VzcGVuc2UsIHBlbmRpbmdCcmFuY2gpO1xuICAgICAgc3VzcGVuc2UucGVuZGluZ0JyYW5jaCA9IG51bGw7XG4gICAgICBzdXNwZW5zZS5pc0luRmFsbGJhY2sgPSBmYWxzZTtcbiAgICAgIGxldCBwYXJlbnQgPSBzdXNwZW5zZS5wYXJlbnQ7XG4gICAgICBsZXQgaGFzVW5yZXNvbHZlZEFuY2VzdG9yID0gZmFsc2U7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmIChwYXJlbnQucGVuZGluZ0JyYW5jaCkge1xuICAgICAgICAgIHBhcmVudC5lZmZlY3RzLnB1c2goLi4uZWZmZWN0cyk7XG4gICAgICAgICAgaGFzVW5yZXNvbHZlZEFuY2VzdG9yID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuICAgICAgaWYgKCFoYXNVbnJlc29sdmVkQW5jZXN0b3IpIHtcbiAgICAgICAgcXVldWVQb3N0Rmx1c2hDYihlZmZlY3RzKTtcbiAgICAgIH1cbiAgICAgIHN1c3BlbnNlLmVmZmVjdHMgPSBbXTtcbiAgICAgIGlmIChpc1N1c3BlbnNpYmxlKSB7XG4gICAgICAgIGlmIChwYXJlbnRTdXNwZW5zZSAmJiBwYXJlbnRTdXNwZW5zZS5wZW5kaW5nQnJhbmNoICYmIHBhcmVudFN1c3BlbnNlSWQgPT09IHBhcmVudFN1c3BlbnNlLnBlbmRpbmdJZCkge1xuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLmRlcHMtLTtcbiAgICAgICAgICBpZiAocGFyZW50U3VzcGVuc2UuZGVwcyA9PT0gMCAmJiAhc3luYykge1xuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UucmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdHJpZ2dlckV2ZW50KHZub2RlMiwgXCJvblJlc29sdmVcIik7XG4gICAgfSxcbiAgICBmYWxsYmFjayhmYWxsYmFja1ZOb2RlKSB7XG4gICAgICBpZiAoIXN1c3BlbnNlLnBlbmRpbmdCcmFuY2gpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgeyB2bm9kZTogdm5vZGUyLCBhY3RpdmVCcmFuY2gsIHBhcmVudENvbXBvbmVudDogcGFyZW50Q29tcG9uZW50MiwgY29udGFpbmVyOiBjb250YWluZXIyLCBpc1NWRzogaXNTVkcyIH0gPSBzdXNwZW5zZTtcbiAgICAgIHRyaWdnZXJFdmVudCh2bm9kZTIsIFwib25GYWxsYmFja1wiKTtcbiAgICAgIGNvbnN0IGFuY2hvcjIgPSBuZXh0KGFjdGl2ZUJyYW5jaCk7XG4gICAgICBjb25zdCBtb3VudEZhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXN1c3BlbnNlLmlzSW5GYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXRjaChcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIGZhbGxiYWNrVk5vZGUsXG4gICAgICAgICAgY29udGFpbmVyMixcbiAgICAgICAgICBhbmNob3IyLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudDIsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICAvLyBmYWxsYmFjayB0cmVlIHdpbGwgbm90IGhhdmUgc3VzcGVuc2UgY29udGV4dFxuICAgICAgICAgIGlzU1ZHMixcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICAgIHNldEFjdGl2ZUJyYW5jaChzdXNwZW5zZSwgZmFsbGJhY2tWTm9kZSk7XG4gICAgICB9O1xuICAgICAgY29uc3QgZGVsYXlFbnRlciA9IGZhbGxiYWNrVk5vZGUudHJhbnNpdGlvbiAmJiBmYWxsYmFja1ZOb2RlLnRyYW5zaXRpb24ubW9kZSA9PT0gXCJvdXQtaW5cIjtcbiAgICAgIGlmIChkZWxheUVudGVyKSB7XG4gICAgICAgIGFjdGl2ZUJyYW5jaC50cmFuc2l0aW9uLmFmdGVyTGVhdmUgPSBtb3VudEZhbGxiYWNrO1xuICAgICAgfVxuICAgICAgc3VzcGVuc2UuaXNJbkZhbGxiYWNrID0gdHJ1ZTtcbiAgICAgIHVubW91bnQoXG4gICAgICAgIGFjdGl2ZUJyYW5jaCxcbiAgICAgICAgcGFyZW50Q29tcG9uZW50MixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgLy8gbm8gc3VzcGVuc2Ugc28gdW5tb3VudCBob29rcyBmaXJlIG5vd1xuICAgICAgICB0cnVlXG4gICAgICAgIC8vIHNob3VsZFJlbW92ZVxuICAgICAgKTtcbiAgICAgIGlmICghZGVsYXlFbnRlcikge1xuICAgICAgICBtb3VudEZhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBtb3ZlKGNvbnRhaW5lcjIsIGFuY2hvcjIsIHR5cGUpIHtcbiAgICAgIHN1c3BlbnNlLmFjdGl2ZUJyYW5jaCAmJiBtb3ZlKHN1c3BlbnNlLmFjdGl2ZUJyYW5jaCwgY29udGFpbmVyMiwgYW5jaG9yMiwgdHlwZSk7XG4gICAgICBzdXNwZW5zZS5jb250YWluZXIgPSBjb250YWluZXIyO1xuICAgIH0sXG4gICAgbmV4dCgpIHtcbiAgICAgIHJldHVybiBzdXNwZW5zZS5hY3RpdmVCcmFuY2ggJiYgbmV4dChzdXNwZW5zZS5hY3RpdmVCcmFuY2gpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJEZXAoaW5zdGFuY2UsIHNldHVwUmVuZGVyRWZmZWN0KSB7XG4gICAgICBjb25zdCBpc0luUGVuZGluZ1N1c3BlbnNlID0gISFzdXNwZW5zZS5wZW5kaW5nQnJhbmNoO1xuICAgICAgaWYgKGlzSW5QZW5kaW5nU3VzcGVuc2UpIHtcbiAgICAgICAgc3VzcGVuc2UuZGVwcysrO1xuICAgICAgfVxuICAgICAgY29uc3QgaHlkcmF0ZWRFbCA9IGluc3RhbmNlLnZub2RlLmVsO1xuICAgICAgaW5zdGFuY2UuYXN5bmNEZXAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBoYW5kbGVFcnJvcihlcnIsIGluc3RhbmNlLCAwKTtcbiAgICAgIH0pLnRoZW4oKGFzeW5jU2V0dXBSZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGluc3RhbmNlLmlzVW5tb3VudGVkIHx8IHN1c3BlbnNlLmlzVW5tb3VudGVkIHx8IHN1c3BlbnNlLnBlbmRpbmdJZCAhPT0gaW5zdGFuY2Uuc3VzcGVuc2VJZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpbnN0YW5jZS5hc3luY1Jlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgeyB2bm9kZTogdm5vZGUyIH0gPSBpbnN0YW5jZTtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICBwdXNoV2FybmluZ0NvbnRleHQodm5vZGUyKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVTZXR1cFJlc3VsdChpbnN0YW5jZSwgYXN5bmNTZXR1cFJlc3VsdCwgZmFsc2UpO1xuICAgICAgICBpZiAoaHlkcmF0ZWRFbCkge1xuICAgICAgICAgIHZub2RlMi5lbCA9IGh5ZHJhdGVkRWw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSAhaHlkcmF0ZWRFbCAmJiBpbnN0YW5jZS5zdWJUcmVlLmVsO1xuICAgICAgICBzZXR1cFJlbmRlckVmZmVjdChcbiAgICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgICB2bm9kZTIsXG4gICAgICAgICAgLy8gY29tcG9uZW50IG1heSBoYXZlIGJlZW4gbW92ZWQgYmVmb3JlIHJlc29sdmUuXG4gICAgICAgICAgLy8gaWYgdGhpcyBpcyBub3QgYSBoeWRyYXRpb24sIGluc3RhbmNlLnN1YlRyZWUgd2lsbCBiZSB0aGUgY29tbWVudFxuICAgICAgICAgIC8vIHBsYWNlaG9sZGVyLlxuICAgICAgICAgIHBhcmVudE5vZGUoaHlkcmF0ZWRFbCB8fCBpbnN0YW5jZS5zdWJUcmVlLmVsKSxcbiAgICAgICAgICAvLyBhbmNob3Igd2lsbCBub3QgYmUgdXNlZCBpZiB0aGlzIGlzIGh5ZHJhdGlvbiwgc28gb25seSBuZWVkIHRvXG4gICAgICAgICAgLy8gY29uc2lkZXIgdGhlIGNvbW1lbnQgcGxhY2Vob2xkZXIgY2FzZS5cbiAgICAgICAgICBoeWRyYXRlZEVsID8gbnVsbCA6IG5leHQoaW5zdGFuY2Uuc3ViVHJlZSksXG4gICAgICAgICAgc3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICAgIGlmIChwbGFjZWhvbGRlcikge1xuICAgICAgICAgIHJlbW92ZShwbGFjZWhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlSE9DSG9zdEVsKGluc3RhbmNlLCB2bm9kZTIuZWwpO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHBvcFdhcm5pbmdDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5QZW5kaW5nU3VzcGVuc2UgJiYgLS1zdXNwZW5zZS5kZXBzID09PSAwKSB7XG4gICAgICAgICAgc3VzcGVuc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHVubW91bnQocGFyZW50U3VzcGVuc2UyLCBkb1JlbW92ZSkge1xuICAgICAgc3VzcGVuc2UuaXNVbm1vdW50ZWQgPSB0cnVlO1xuICAgICAgaWYgKHN1c3BlbnNlLmFjdGl2ZUJyYW5jaCkge1xuICAgICAgICB1bm1vdW50KFxuICAgICAgICAgIHN1c3BlbnNlLmFjdGl2ZUJyYW5jaCxcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UyLFxuICAgICAgICAgIGRvUmVtb3ZlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc3VzcGVuc2UucGVuZGluZ0JyYW5jaCkge1xuICAgICAgICB1bm1vdW50KFxuICAgICAgICAgIHN1c3BlbnNlLnBlbmRpbmdCcmFuY2gsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlMixcbiAgICAgICAgICBkb1JlbW92ZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHN1c3BlbnNlO1xufVxuZnVuY3Rpb24gaHlkcmF0ZVN1c3BlbnNlKG5vZGUsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgc2xvdFNjb3BlSWRzLCBvcHRpbWl6ZWQsIHJlbmRlcmVySW50ZXJuYWxzLCBoeWRyYXRlTm9kZSkge1xuICBjb25zdCBzdXNwZW5zZSA9IHZub2RlLnN1c3BlbnNlID0gY3JlYXRlU3VzcGVuc2VCb3VuZGFyeShcbiAgICB2bm9kZSxcbiAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgbm9kZS5wYXJlbnROb2RlLFxuICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgbnVsbCxcbiAgICBpc1NWRyxcbiAgICBzbG90U2NvcGVJZHMsXG4gICAgb3B0aW1pemVkLFxuICAgIHJlbmRlcmVySW50ZXJuYWxzLFxuICAgIHRydWVcbiAgICAvKiBoeWRyYXRpbmcgKi9cbiAgKTtcbiAgY29uc3QgcmVzdWx0ID0gaHlkcmF0ZU5vZGUoXG4gICAgbm9kZSxcbiAgICBzdXNwZW5zZS5wZW5kaW5nQnJhbmNoID0gdm5vZGUuc3NDb250ZW50LFxuICAgIHBhcmVudENvbXBvbmVudCxcbiAgICBzdXNwZW5zZSxcbiAgICBzbG90U2NvcGVJZHMsXG4gICAgb3B0aW1pemVkXG4gICk7XG4gIGlmIChzdXNwZW5zZS5kZXBzID09PSAwKSB7XG4gICAgc3VzcGVuc2UucmVzb2x2ZShmYWxzZSwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN1c3BlbnNlQ2hpbGRyZW4odm5vZGUpIHtcbiAgY29uc3QgeyBzaGFwZUZsYWcsIGNoaWxkcmVuIH0gPSB2bm9kZTtcbiAgY29uc3QgaXNTbG90Q2hpbGRyZW4gPSBzaGFwZUZsYWcgJiAzMjtcbiAgdm5vZGUuc3NDb250ZW50ID0gbm9ybWFsaXplU3VzcGVuc2VTbG90KFxuICAgIGlzU2xvdENoaWxkcmVuID8gY2hpbGRyZW4uZGVmYXVsdCA6IGNoaWxkcmVuXG4gICk7XG4gIHZub2RlLnNzRmFsbGJhY2sgPSBpc1Nsb3RDaGlsZHJlbiA/IG5vcm1hbGl6ZVN1c3BlbnNlU2xvdChjaGlsZHJlbi5mYWxsYmFjaykgOiBjcmVhdGVWTm9kZShDb21tZW50KTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN1c3BlbnNlU2xvdChzKSB7XG4gIGxldCBibG9jaztcbiAgaWYgKGlzRnVuY3Rpb24ocykpIHtcbiAgICBjb25zdCB0cmFja0Jsb2NrID0gaXNCbG9ja1RyZWVFbmFibGVkICYmIHMuX2M7XG4gICAgaWYgKHRyYWNrQmxvY2spIHtcbiAgICAgIHMuX2QgPSBmYWxzZTtcbiAgICAgIG9wZW5CbG9jaygpO1xuICAgIH1cbiAgICBzID0gcygpO1xuICAgIGlmICh0cmFja0Jsb2NrKSB7XG4gICAgICBzLl9kID0gdHJ1ZTtcbiAgICAgIGJsb2NrID0gY3VycmVudEJsb2NrO1xuICAgICAgY2xvc2VCbG9jaygpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNBcnJheShzKSkge1xuICAgIGNvbnN0IHNpbmdsZUNoaWxkID0gZmlsdGVyU2luZ2xlUm9vdChzKTtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhc2luZ2xlQ2hpbGQpIHtcbiAgICAgIHdhcm4oYDxTdXNwZW5zZT4gc2xvdHMgZXhwZWN0IGEgc2luZ2xlIHJvb3Qgbm9kZS5gKTtcbiAgICB9XG4gICAgcyA9IHNpbmdsZUNoaWxkO1xuICB9XG4gIHMgPSBub3JtYWxpemVWTm9kZShzKTtcbiAgaWYgKGJsb2NrICYmICFzLmR5bmFtaWNDaGlsZHJlbikge1xuICAgIHMuZHluYW1pY0NoaWxkcmVuID0gYmxvY2suZmlsdGVyKChjKSA9PiBjICE9PSBzKTtcbiAgfVxuICByZXR1cm4gcztcbn1cbmZ1bmN0aW9uIHF1ZXVlRWZmZWN0V2l0aFN1c3BlbnNlKGZuLCBzdXNwZW5zZSkge1xuICBpZiAoc3VzcGVuc2UgJiYgc3VzcGVuc2UucGVuZGluZ0JyYW5jaCkge1xuICAgIGlmIChpc0FycmF5KGZuKSkge1xuICAgICAgc3VzcGVuc2UuZWZmZWN0cy5wdXNoKC4uLmZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VzcGVuc2UuZWZmZWN0cy5wdXNoKGZuKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcXVldWVQb3N0Rmx1c2hDYihmbik7XG4gIH1cbn1cbmZ1bmN0aW9uIHNldEFjdGl2ZUJyYW5jaChzdXNwZW5zZSwgYnJhbmNoKSB7XG4gIHN1c3BlbnNlLmFjdGl2ZUJyYW5jaCA9IGJyYW5jaDtcbiAgY29uc3QgeyB2bm9kZSwgcGFyZW50Q29tcG9uZW50IH0gPSBzdXNwZW5zZTtcbiAgY29uc3QgZWwgPSB2bm9kZS5lbCA9IGJyYW5jaC5lbDtcbiAgaWYgKHBhcmVudENvbXBvbmVudCAmJiBwYXJlbnRDb21wb25lbnQuc3ViVHJlZSA9PT0gdm5vZGUpIHtcbiAgICBwYXJlbnRDb21wb25lbnQudm5vZGUuZWwgPSBlbDtcbiAgICB1cGRhdGVIT0NIb3N0RWwocGFyZW50Q29tcG9uZW50LCBlbCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzVk5vZGVTdXNwZW5zaWJsZSh2bm9kZSkge1xuICB2YXIgX2E7XG4gIHJldHVybiAoKF9hID0gdm5vZGUucHJvcHMpID09IG51bGwgPyB2b2lkIDAgOiBfYS5zdXNwZW5zaWJsZSkgIT0gbnVsbCAmJiB2bm9kZS5wcm9wcy5zdXNwZW5zaWJsZSAhPT0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHdhdGNoRWZmZWN0KGVmZmVjdCwgb3B0aW9ucykge1xuICByZXR1cm4gZG9XYXRjaChlZmZlY3QsIG51bGwsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gd2F0Y2hQb3N0RWZmZWN0KGVmZmVjdCwgb3B0aW9ucykge1xuICByZXR1cm4gZG9XYXRjaChcbiAgICBlZmZlY3QsXG4gICAgbnVsbCxcbiAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpID8gZXh0ZW5kKHt9LCBvcHRpb25zLCB7IGZsdXNoOiBcInBvc3RcIiB9KSA6IHsgZmx1c2g6IFwicG9zdFwiIH1cbiAgKTtcbn1cbmZ1bmN0aW9uIHdhdGNoU3luY0VmZmVjdChlZmZlY3QsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGRvV2F0Y2goXG4gICAgZWZmZWN0LFxuICAgIG51bGwsXG4gICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IGV4dGVuZCh7fSwgb3B0aW9ucywgeyBmbHVzaDogXCJzeW5jXCIgfSkgOiB7IGZsdXNoOiBcInN5bmNcIiB9XG4gICk7XG59XG5jb25zdCBJTklUSUFMX1dBVENIRVJfVkFMVUUgPSB7fTtcbmZ1bmN0aW9uIHdhdGNoKHNvdXJjZSwgY2IsIG9wdGlvbnMpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWlzRnVuY3Rpb24oY2IpKSB7XG4gICAgd2FybihcbiAgICAgIGBcXGB3YXRjaChmbiwgb3B0aW9ucz8pXFxgIHNpZ25hdHVyZSBoYXMgYmVlbiBtb3ZlZCB0byBhIHNlcGFyYXRlIEFQSS4gVXNlIFxcYHdhdGNoRWZmZWN0KGZuLCBvcHRpb25zPylcXGAgaW5zdGVhZC4gXFxgd2F0Y2hcXGAgbm93IG9ubHkgc3VwcG9ydHMgXFxgd2F0Y2goc291cmNlLCBjYiwgb3B0aW9ucz8pIHNpZ25hdHVyZS5gXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZG9XYXRjaChzb3VyY2UsIGNiLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIGRvV2F0Y2goc291cmNlLCBjYiwgeyBpbW1lZGlhdGUsIGRlZXAsIGZsdXNoLCBvblRyYWNrLCBvblRyaWdnZXIgfSA9IEVNUFRZX09CSikge1xuICB2YXIgX2E7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFjYikge1xuICAgIGlmIChpbW1lZGlhdGUgIT09IHZvaWQgMCkge1xuICAgICAgd2FybihcbiAgICAgICAgYHdhdGNoKCkgXCJpbW1lZGlhdGVcIiBvcHRpb24gaXMgb25seSByZXNwZWN0ZWQgd2hlbiB1c2luZyB0aGUgd2F0Y2goc291cmNlLCBjYWxsYmFjaywgb3B0aW9ucz8pIHNpZ25hdHVyZS5gXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoZGVlcCAhPT0gdm9pZCAwKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgd2F0Y2goKSBcImRlZXBcIiBvcHRpb24gaXMgb25seSByZXNwZWN0ZWQgd2hlbiB1c2luZyB0aGUgd2F0Y2goc291cmNlLCBjYWxsYmFjaywgb3B0aW9ucz8pIHNpZ25hdHVyZS5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBjb25zdCB3YXJuSW52YWxpZFNvdXJjZSA9IChzKSA9PiB7XG4gICAgd2FybihcbiAgICAgIGBJbnZhbGlkIHdhdGNoIHNvdXJjZTogYCxcbiAgICAgIHMsXG4gICAgICBgQSB3YXRjaCBzb3VyY2UgY2FuIG9ubHkgYmUgYSBnZXR0ZXIvZWZmZWN0IGZ1bmN0aW9uLCBhIHJlZiwgYSByZWFjdGl2ZSBvYmplY3QsIG9yIGFuIGFycmF5IG9mIHRoZXNlIHR5cGVzLmBcbiAgICApO1xuICB9O1xuICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRTY29wZSgpID09PSAoKF9hID0gY3VycmVudEluc3RhbmNlKSA9PSBudWxsID8gdm9pZCAwIDogX2Euc2NvcGUpID8gY3VycmVudEluc3RhbmNlIDogbnVsbDtcbiAgbGV0IGdldHRlcjtcbiAgbGV0IGZvcmNlVHJpZ2dlciA9IGZhbHNlO1xuICBsZXQgaXNNdWx0aVNvdXJjZSA9IGZhbHNlO1xuICBpZiAoaXNSZWYoc291cmNlKSkge1xuICAgIGdldHRlciA9ICgpID0+IHNvdXJjZS52YWx1ZTtcbiAgICBmb3JjZVRyaWdnZXIgPSBpc1NoYWxsb3ckMShzb3VyY2UpO1xuICB9IGVsc2UgaWYgKGlzUmVhY3RpdmUoc291cmNlKSkge1xuICAgIGdldHRlciA9ICgpID0+IHNvdXJjZTtcbiAgICBkZWVwID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHNvdXJjZSkpIHtcbiAgICBpc011bHRpU291cmNlID0gdHJ1ZTtcbiAgICBmb3JjZVRyaWdnZXIgPSBzb3VyY2Uuc29tZSgocykgPT4gaXNSZWFjdGl2ZShzKSB8fCBpc1NoYWxsb3ckMShzKSk7XG4gICAgZ2V0dGVyID0gKCkgPT4gc291cmNlLm1hcCgocykgPT4ge1xuICAgICAgaWYgKGlzUmVmKHMpKSB7XG4gICAgICAgIHJldHVybiBzLnZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChpc1JlYWN0aXZlKHMpKSB7XG4gICAgICAgIHJldHVybiB0cmF2ZXJzZShzKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihzKSkge1xuICAgICAgICByZXR1cm4gY2FsbFdpdGhFcnJvckhhbmRsaW5nKHMsIGluc3RhbmNlLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybkludmFsaWRTb3VyY2Uocyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihzb3VyY2UpKSB7XG4gICAgaWYgKGNiKSB7XG4gICAgICBnZXR0ZXIgPSAoKSA9PiBjYWxsV2l0aEVycm9ySGFuZGxpbmcoc291cmNlLCBpbnN0YW5jZSwgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdldHRlciA9ICgpID0+IHtcbiAgICAgICAgaWYgKGluc3RhbmNlICYmIGluc3RhbmNlLmlzVW5tb3VudGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbGVhbnVwKSB7XG4gICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhcbiAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgMyxcbiAgICAgICAgICBbb25DbGVhbnVwXVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZ2V0dGVyID0gTk9PUDtcbiAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm5JbnZhbGlkU291cmNlKHNvdXJjZSk7XG4gIH1cbiAgaWYgKGNiICYmIGRlZXApIHtcbiAgICBjb25zdCBiYXNlR2V0dGVyID0gZ2V0dGVyO1xuICAgIGdldHRlciA9ICgpID0+IHRyYXZlcnNlKGJhc2VHZXR0ZXIoKSk7XG4gIH1cbiAgbGV0IGNsZWFudXA7XG4gIGxldCBvbkNsZWFudXAgPSAoZm4pID0+IHtcbiAgICBjbGVhbnVwID0gZWZmZWN0Lm9uU3RvcCA9ICgpID0+IHtcbiAgICAgIGNhbGxXaXRoRXJyb3JIYW5kbGluZyhmbiwgaW5zdGFuY2UsIDQpO1xuICAgIH07XG4gIH07XG4gIGxldCBzc3JDbGVhbnVwO1xuICBpZiAoaXNJblNTUkNvbXBvbmVudFNldHVwKSB7XG4gICAgb25DbGVhbnVwID0gTk9PUDtcbiAgICBpZiAoIWNiKSB7XG4gICAgICBnZXR0ZXIoKTtcbiAgICB9IGVsc2UgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoY2IsIGluc3RhbmNlLCAzLCBbXG4gICAgICAgIGdldHRlcigpLFxuICAgICAgICBpc011bHRpU291cmNlID8gW10gOiB2b2lkIDAsXG4gICAgICAgIG9uQ2xlYW51cFxuICAgICAgXSk7XG4gICAgfVxuICAgIGlmIChmbHVzaCA9PT0gXCJzeW5jXCIpIHtcbiAgICAgIGNvbnN0IGN0eCA9IHVzZVNTUkNvbnRleHQoKTtcbiAgICAgIHNzckNsZWFudXAgPSBjdHguX193YXRjaGVySGFuZGxlcyB8fCAoY3R4Ll9fd2F0Y2hlckhhbmRsZXMgPSBbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOT09QO1xuICAgIH1cbiAgfVxuICBsZXQgb2xkVmFsdWUgPSBpc011bHRpU291cmNlID8gbmV3IEFycmF5KHNvdXJjZS5sZW5ndGgpLmZpbGwoSU5JVElBTF9XQVRDSEVSX1ZBTFVFKSA6IElOSVRJQUxfV0FUQ0hFUl9WQUxVRTtcbiAgY29uc3Qgam9iID0gKCkgPT4ge1xuICAgIGlmICghZWZmZWN0LmFjdGl2ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZWZmZWN0LnJ1bigpO1xuICAgICAgaWYgKGRlZXAgfHwgZm9yY2VUcmlnZ2VyIHx8IChpc011bHRpU291cmNlID8gbmV3VmFsdWUuc29tZShcbiAgICAgICAgKHYsIGkpID0+IGhhc0NoYW5nZWQodiwgb2xkVmFsdWVbaV0pXG4gICAgICApIDogaGFzQ2hhbmdlZChuZXdWYWx1ZSwgb2xkVmFsdWUpKSB8fCBmYWxzZSkge1xuICAgICAgICBpZiAoY2xlYW51cCkge1xuICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhjYiwgaW5zdGFuY2UsIDMsIFtcbiAgICAgICAgICBuZXdWYWx1ZSxcbiAgICAgICAgICAvLyBwYXNzIHVuZGVmaW5lZCBhcyB0aGUgb2xkIHZhbHVlIHdoZW4gaXQncyBjaGFuZ2VkIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgIG9sZFZhbHVlID09PSBJTklUSUFMX1dBVENIRVJfVkFMVUUgPyB2b2lkIDAgOiBpc011bHRpU291cmNlICYmIG9sZFZhbHVlWzBdID09PSBJTklUSUFMX1dBVENIRVJfVkFMVUUgPyBbXSA6IG9sZFZhbHVlLFxuICAgICAgICAgIG9uQ2xlYW51cFxuICAgICAgICBdKTtcbiAgICAgICAgb2xkVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWZmZWN0LnJ1bigpO1xuICAgIH1cbiAgfTtcbiAgam9iLmFsbG93UmVjdXJzZSA9ICEhY2I7XG4gIGxldCBzY2hlZHVsZXI7XG4gIGlmIChmbHVzaCA9PT0gXCJzeW5jXCIpIHtcbiAgICBzY2hlZHVsZXIgPSBqb2I7XG4gIH0gZWxzZSBpZiAoZmx1c2ggPT09IFwicG9zdFwiKSB7XG4gICAgc2NoZWR1bGVyID0gKCkgPT4gcXVldWVQb3N0UmVuZGVyRWZmZWN0KGpvYiwgaW5zdGFuY2UgJiYgaW5zdGFuY2Uuc3VzcGVuc2UpO1xuICB9IGVsc2Uge1xuICAgIGpvYi5wcmUgPSB0cnVlO1xuICAgIGlmIChpbnN0YW5jZSlcbiAgICAgIGpvYi5pZCA9IGluc3RhbmNlLnVpZDtcbiAgICBzY2hlZHVsZXIgPSAoKSA9PiBxdWV1ZUpvYihqb2IpO1xuICB9XG4gIGNvbnN0IGVmZmVjdCA9IG5ldyBSZWFjdGl2ZUVmZmVjdChnZXR0ZXIsIHNjaGVkdWxlcik7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgZWZmZWN0Lm9uVHJhY2sgPSBvblRyYWNrO1xuICAgIGVmZmVjdC5vblRyaWdnZXIgPSBvblRyaWdnZXI7XG4gIH1cbiAgaWYgKGNiKSB7XG4gICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgam9iKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFZhbHVlID0gZWZmZWN0LnJ1bigpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChmbHVzaCA9PT0gXCJwb3N0XCIpIHtcbiAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoXG4gICAgICBlZmZlY3QucnVuLmJpbmQoZWZmZWN0KSxcbiAgICAgIGluc3RhbmNlICYmIGluc3RhbmNlLnN1c3BlbnNlXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBlZmZlY3QucnVuKCk7XG4gIH1cbiAgY29uc3QgdW53YXRjaCA9ICgpID0+IHtcbiAgICBlZmZlY3Quc3RvcCgpO1xuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5zY29wZSkge1xuICAgICAgcmVtb3ZlKGluc3RhbmNlLnNjb3BlLmVmZmVjdHMsIGVmZmVjdCk7XG4gICAgfVxuICB9O1xuICBpZiAoc3NyQ2xlYW51cClcbiAgICBzc3JDbGVhbnVwLnB1c2godW53YXRjaCk7XG4gIHJldHVybiB1bndhdGNoO1xufVxuZnVuY3Rpb24gaW5zdGFuY2VXYXRjaChzb3VyY2UsIHZhbHVlLCBvcHRpb25zKSB7XG4gIGNvbnN0IHB1YmxpY1RoaXMgPSB0aGlzLnByb3h5O1xuICBjb25zdCBnZXR0ZXIgPSBpc1N0cmluZyhzb3VyY2UpID8gc291cmNlLmluY2x1ZGVzKFwiLlwiKSA/IGNyZWF0ZVBhdGhHZXR0ZXIocHVibGljVGhpcywgc291cmNlKSA6ICgpID0+IHB1YmxpY1RoaXNbc291cmNlXSA6IHNvdXJjZS5iaW5kKHB1YmxpY1RoaXMsIHB1YmxpY1RoaXMpO1xuICBsZXQgY2I7XG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIGNiID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgY2IgPSB2YWx1ZS5oYW5kbGVyO1xuICAgIG9wdGlvbnMgPSB2YWx1ZTtcbiAgfVxuICBjb25zdCBjdXIgPSBjdXJyZW50SW5zdGFuY2U7XG4gIHNldEN1cnJlbnRJbnN0YW5jZSh0aGlzKTtcbiAgY29uc3QgcmVzID0gZG9XYXRjaChnZXR0ZXIsIGNiLmJpbmQocHVibGljVGhpcyksIG9wdGlvbnMpO1xuICBpZiAoY3VyKSB7XG4gICAgc2V0Q3VycmVudEluc3RhbmNlKGN1cik7XG4gIH0gZWxzZSB7XG4gICAgdW5zZXRDdXJyZW50SW5zdGFuY2UoKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gY3JlYXRlUGF0aEdldHRlcihjdHgsIHBhdGgpIHtcbiAgY29uc3Qgc2VnbWVudHMgPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBsZXQgY3VyID0gY3R4O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoICYmIGN1cjsgaSsrKSB7XG4gICAgICBjdXIgPSBjdXJbc2VnbWVudHNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gY3VyO1xuICB9O1xufVxuZnVuY3Rpb24gdHJhdmVyc2UodmFsdWUsIHNlZW4pIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgdmFsdWVbXCJfX3Zfc2tpcFwiXSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzZWVuID0gc2VlbiB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBpZiAoc2Vlbi5oYXModmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHNlZW4uYWRkKHZhbHVlKTtcbiAgaWYgKGlzUmVmKHZhbHVlKSkge1xuICAgIHRyYXZlcnNlKHZhbHVlLnZhbHVlLCBzZWVuKTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRyYXZlcnNlKHZhbHVlW2ldLCBzZWVuKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTZXQodmFsdWUpIHx8IGlzTWFwKHZhbHVlKSkge1xuICAgIHZhbHVlLmZvckVhY2goKHYpID0+IHtcbiAgICAgIHRyYXZlcnNlKHYsIHNlZW4pO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdmFsdWUpIHtcbiAgICAgIHRyYXZlcnNlKHZhbHVlW2tleV0sIHNlZW4pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRGlyZWN0aXZlTmFtZShuYW1lKSB7XG4gIGlmIChpc0J1aWx0SW5EaXJlY3RpdmUobmFtZSkpIHtcbiAgICB3YXJuKFwiRG8gbm90IHVzZSBidWlsdC1pbiBkaXJlY3RpdmUgaWRzIGFzIGN1c3RvbSBkaXJlY3RpdmUgaWQ6IFwiICsgbmFtZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHdpdGhEaXJlY3RpdmVzKHZub2RlLCBkaXJlY3RpdmVzKSB7XG4gIGNvbnN0IGludGVybmFsSW5zdGFuY2UgPSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2U7XG4gIGlmIChpbnRlcm5hbEluc3RhbmNlID09PSBudWxsKSB7XG4gICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB3YXJuKGB3aXRoRGlyZWN0aXZlcyBjYW4gb25seSBiZSB1c2VkIGluc2lkZSByZW5kZXIgZnVuY3Rpb25zLmApO1xuICAgIHJldHVybiB2bm9kZTtcbiAgfVxuICBjb25zdCBpbnN0YW5jZSA9IGdldEV4cG9zZVByb3h5KGludGVybmFsSW5zdGFuY2UpIHx8IGludGVybmFsSW5zdGFuY2UucHJveHk7XG4gIGNvbnN0IGJpbmRpbmdzID0gdm5vZGUuZGlycyB8fCAodm5vZGUuZGlycyA9IFtdKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IFtkaXIsIHZhbHVlLCBhcmcsIG1vZGlmaWVycyA9IEVNUFRZX09CSl0gPSBkaXJlY3RpdmVzW2ldO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKGRpcikpIHtcbiAgICAgICAgZGlyID0ge1xuICAgICAgICAgIG1vdW50ZWQ6IGRpcixcbiAgICAgICAgICB1cGRhdGVkOiBkaXJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXIuZGVlcCkge1xuICAgICAgICB0cmF2ZXJzZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBiaW5kaW5ncy5wdXNoKHtcbiAgICAgICAgZGlyLFxuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIG9sZFZhbHVlOiB2b2lkIDAsXG4gICAgICAgIGFyZyxcbiAgICAgICAgbW9kaWZpZXJzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZub2RlO1xufVxuZnVuY3Rpb24gaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgcHJldlZOb2RlLCBpbnN0YW5jZSwgbmFtZSkge1xuICBjb25zdCBiaW5kaW5ncyA9IHZub2RlLmRpcnM7XG4gIGNvbnN0IG9sZEJpbmRpbmdzID0gcHJldlZOb2RlICYmIHByZXZWTm9kZS5kaXJzO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJpbmRpbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYmluZGluZyA9IGJpbmRpbmdzW2ldO1xuICAgIGlmIChvbGRCaW5kaW5ncykge1xuICAgICAgYmluZGluZy5vbGRWYWx1ZSA9IG9sZEJpbmRpbmdzW2ldLnZhbHVlO1xuICAgIH1cbiAgICBsZXQgaG9vayA9IGJpbmRpbmcuZGlyW25hbWVdO1xuICAgIGlmIChob29rKSB7XG4gICAgICBwYXVzZVRyYWNraW5nKCk7XG4gICAgICBjYWxsV2l0aEFzeW5jRXJyb3JIYW5kbGluZyhob29rLCBpbnN0YW5jZSwgOCwgW1xuICAgICAgICB2bm9kZS5lbCxcbiAgICAgICAgYmluZGluZyxcbiAgICAgICAgdm5vZGUsXG4gICAgICAgIHByZXZWTm9kZVxuICAgICAgXSk7XG4gICAgICByZXNldFRyYWNraW5nKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHVzZVRyYW5zaXRpb25TdGF0ZSgpIHtcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgaXNNb3VudGVkOiBmYWxzZSxcbiAgICBpc0xlYXZpbmc6IGZhbHNlLFxuICAgIGlzVW5tb3VudGluZzogZmFsc2UsXG4gICAgbGVhdmluZ1ZOb2RlczogLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKVxuICB9O1xuICBvbk1vdW50ZWQoKCkgPT4ge1xuICAgIHN0YXRlLmlzTW91bnRlZCA9IHRydWU7XG4gIH0pO1xuICBvbkJlZm9yZVVubW91bnQoKCkgPT4ge1xuICAgIHN0YXRlLmlzVW5tb3VudGluZyA9IHRydWU7XG4gIH0pO1xuICByZXR1cm4gc3RhdGU7XG59XG5jb25zdCBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvciA9IFtGdW5jdGlvbiwgQXJyYXldO1xuY29uc3QgQmFzZVRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMgPSB7XG4gIG1vZGU6IFN0cmluZyxcbiAgYXBwZWFyOiBCb29sZWFuLFxuICBwZXJzaXN0ZWQ6IEJvb2xlYW4sXG4gIC8vIGVudGVyXG4gIG9uQmVmb3JlRW50ZXI6IFRyYW5zaXRpb25Ib29rVmFsaWRhdG9yLFxuICBvbkVudGVyOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvcixcbiAgb25BZnRlckVudGVyOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvcixcbiAgb25FbnRlckNhbmNlbGxlZDogVHJhbnNpdGlvbkhvb2tWYWxpZGF0b3IsXG4gIC8vIGxlYXZlXG4gIG9uQmVmb3JlTGVhdmU6IFRyYW5zaXRpb25Ib29rVmFsaWRhdG9yLFxuICBvbkxlYXZlOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvcixcbiAgb25BZnRlckxlYXZlOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvcixcbiAgb25MZWF2ZUNhbmNlbGxlZDogVHJhbnNpdGlvbkhvb2tWYWxpZGF0b3IsXG4gIC8vIGFwcGVhclxuICBvbkJlZm9yZUFwcGVhcjogVHJhbnNpdGlvbkhvb2tWYWxpZGF0b3IsXG4gIG9uQXBwZWFyOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvcixcbiAgb25BZnRlckFwcGVhcjogVHJhbnNpdGlvbkhvb2tWYWxpZGF0b3IsXG4gIG9uQXBwZWFyQ2FuY2VsbGVkOiBUcmFuc2l0aW9uSG9va1ZhbGlkYXRvclxufTtcbmNvbnN0IEJhc2VUcmFuc2l0aW9uSW1wbCA9IHtcbiAgbmFtZTogYEJhc2VUcmFuc2l0aW9uYCxcbiAgcHJvcHM6IEJhc2VUcmFuc2l0aW9uUHJvcHNWYWxpZGF0b3JzLFxuICBzZXR1cChwcm9wcywgeyBzbG90cyB9KSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcbiAgICBjb25zdCBzdGF0ZSA9IHVzZVRyYW5zaXRpb25TdGF0ZSgpO1xuICAgIGxldCBwcmV2VHJhbnNpdGlvbktleTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBzbG90cy5kZWZhdWx0ICYmIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbihzbG90cy5kZWZhdWx0KCksIHRydWUpO1xuICAgICAgaWYgKCFjaGlsZHJlbiB8fCAhY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuWzBdO1xuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGV0IGhhc0ZvdW5kID0gZmFsc2U7XG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjLnR5cGUgIT09IENvbW1lbnQpIHtcbiAgICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGhhc0ZvdW5kKSB7XG4gICAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgICAgXCI8dHJhbnNpdGlvbj4gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIHNpbmdsZSBlbGVtZW50IG9yIGNvbXBvbmVudC4gVXNlIDx0cmFuc2l0aW9uLWdyb3VwPiBmb3IgbGlzdHMuXCJcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICBoYXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoISEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmF3UHJvcHMgPSB0b1Jhdyhwcm9wcyk7XG4gICAgICBjb25zdCB7IG1vZGUgfSA9IHJhd1Byb3BzO1xuICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgbW9kZSAmJiBtb2RlICE9PSBcImluLW91dFwiICYmIG1vZGUgIT09IFwib3V0LWluXCIgJiYgbW9kZSAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgd2FybihgaW52YWxpZCA8dHJhbnNpdGlvbj4gbW9kZTogJHttb2RlfWApO1xuICAgICAgfVxuICAgICAgaWYgKHN0YXRlLmlzTGVhdmluZykge1xuICAgICAgICByZXR1cm4gZW1wdHlQbGFjZWhvbGRlcihjaGlsZCk7XG4gICAgICB9XG4gICAgICBjb25zdCBpbm5lckNoaWxkID0gZ2V0S2VlcEFsaXZlQ2hpbGQoY2hpbGQpO1xuICAgICAgaWYgKCFpbm5lckNoaWxkKSB7XG4gICAgICAgIHJldHVybiBlbXB0eVBsYWNlaG9sZGVyKGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVudGVySG9va3MgPSByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKFxuICAgICAgICBpbm5lckNoaWxkLFxuICAgICAgICByYXdQcm9wcyxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGluc3RhbmNlXG4gICAgICApO1xuICAgICAgc2V0VHJhbnNpdGlvbkhvb2tzKGlubmVyQ2hpbGQsIGVudGVySG9va3MpO1xuICAgICAgY29uc3Qgb2xkQ2hpbGQgPSBpbnN0YW5jZS5zdWJUcmVlO1xuICAgICAgY29uc3Qgb2xkSW5uZXJDaGlsZCA9IG9sZENoaWxkICYmIGdldEtlZXBBbGl2ZUNoaWxkKG9sZENoaWxkKTtcbiAgICAgIGxldCB0cmFuc2l0aW9uS2V5Q2hhbmdlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgeyBnZXRUcmFuc2l0aW9uS2V5IH0gPSBpbm5lckNoaWxkLnR5cGU7XG4gICAgICBpZiAoZ2V0VHJhbnNpdGlvbktleSkge1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRUcmFuc2l0aW9uS2V5KCk7XG4gICAgICAgIGlmIChwcmV2VHJhbnNpdGlvbktleSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgcHJldlRyYW5zaXRpb25LZXkgPSBrZXk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ICE9PSBwcmV2VHJhbnNpdGlvbktleSkge1xuICAgICAgICAgIHByZXZUcmFuc2l0aW9uS2V5ID0ga2V5O1xuICAgICAgICAgIHRyYW5zaXRpb25LZXlDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9sZElubmVyQ2hpbGQgJiYgb2xkSW5uZXJDaGlsZC50eXBlICE9PSBDb21tZW50ICYmICghaXNTYW1lVk5vZGVUeXBlKGlubmVyQ2hpbGQsIG9sZElubmVyQ2hpbGQpIHx8IHRyYW5zaXRpb25LZXlDaGFuZ2VkKSkge1xuICAgICAgICBjb25zdCBsZWF2aW5nSG9va3MgPSByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKFxuICAgICAgICAgIG9sZElubmVyQ2hpbGQsXG4gICAgICAgICAgcmF3UHJvcHMsXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgKTtcbiAgICAgICAgc2V0VHJhbnNpdGlvbkhvb2tzKG9sZElubmVyQ2hpbGQsIGxlYXZpbmdIb29rcyk7XG4gICAgICAgIGlmIChtb2RlID09PSBcIm91dC1pblwiKSB7XG4gICAgICAgICAgc3RhdGUuaXNMZWF2aW5nID0gdHJ1ZTtcbiAgICAgICAgICBsZWF2aW5nSG9va3MuYWZ0ZXJMZWF2ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN0YXRlLmlzTGVhdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlLnVwZGF0ZS5hY3RpdmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGVtcHR5UGxhY2Vob2xkZXIoY2hpbGQpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IFwiaW4tb3V0XCIgJiYgaW5uZXJDaGlsZC50eXBlICE9PSBDb21tZW50KSB7XG4gICAgICAgICAgbGVhdmluZ0hvb2tzLmRlbGF5TGVhdmUgPSAoZWwsIGVhcmx5UmVtb3ZlLCBkZWxheWVkTGVhdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxlYXZpbmdWTm9kZXNDYWNoZSA9IGdldExlYXZpbmdOb2Rlc0ZvclR5cGUoXG4gICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICBvbGRJbm5lckNoaWxkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGVhdmluZ1ZOb2Rlc0NhY2hlW1N0cmluZyhvbGRJbm5lckNoaWxkLmtleSldID0gb2xkSW5uZXJDaGlsZDtcbiAgICAgICAgICAgIGVsLl9sZWF2ZUNiID0gKCkgPT4ge1xuICAgICAgICAgICAgICBlYXJseVJlbW92ZSgpO1xuICAgICAgICAgICAgICBlbC5fbGVhdmVDYiA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgZGVsZXRlIGVudGVySG9va3MuZGVsYXllZExlYXZlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGVudGVySG9va3MuZGVsYXllZExlYXZlID0gZGVsYXllZExlYXZlO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9O1xuICB9XG59O1xuY29uc3QgQmFzZVRyYW5zaXRpb24gPSBCYXNlVHJhbnNpdGlvbkltcGw7XG5mdW5jdGlvbiBnZXRMZWF2aW5nTm9kZXNGb3JUeXBlKHN0YXRlLCB2bm9kZSkge1xuICBjb25zdCB7IGxlYXZpbmdWTm9kZXMgfSA9IHN0YXRlO1xuICBsZXQgbGVhdmluZ1ZOb2Rlc0NhY2hlID0gbGVhdmluZ1ZOb2Rlcy5nZXQodm5vZGUudHlwZSk7XG4gIGlmICghbGVhdmluZ1ZOb2Rlc0NhY2hlKSB7XG4gICAgbGVhdmluZ1ZOb2Rlc0NhY2hlID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgbGVhdmluZ1ZOb2Rlcy5zZXQodm5vZGUudHlwZSwgbGVhdmluZ1ZOb2Rlc0NhY2hlKTtcbiAgfVxuICByZXR1cm4gbGVhdmluZ1ZOb2Rlc0NhY2hlO1xufVxuZnVuY3Rpb24gcmVzb2x2ZVRyYW5zaXRpb25Ib29rcyh2bm9kZSwgcHJvcHMsIHN0YXRlLCBpbnN0YW5jZSkge1xuICBjb25zdCB7XG4gICAgYXBwZWFyLFxuICAgIG1vZGUsXG4gICAgcGVyc2lzdGVkID0gZmFsc2UsXG4gICAgb25CZWZvcmVFbnRlcixcbiAgICBvbkVudGVyLFxuICAgIG9uQWZ0ZXJFbnRlcixcbiAgICBvbkVudGVyQ2FuY2VsbGVkLFxuICAgIG9uQmVmb3JlTGVhdmUsXG4gICAgb25MZWF2ZSxcbiAgICBvbkFmdGVyTGVhdmUsXG4gICAgb25MZWF2ZUNhbmNlbGxlZCxcbiAgICBvbkJlZm9yZUFwcGVhcixcbiAgICBvbkFwcGVhcixcbiAgICBvbkFmdGVyQXBwZWFyLFxuICAgIG9uQXBwZWFyQ2FuY2VsbGVkXG4gIH0gPSBwcm9wcztcbiAgY29uc3Qga2V5ID0gU3RyaW5nKHZub2RlLmtleSk7XG4gIGNvbnN0IGxlYXZpbmdWTm9kZXNDYWNoZSA9IGdldExlYXZpbmdOb2Rlc0ZvclR5cGUoc3RhdGUsIHZub2RlKTtcbiAgY29uc3QgY2FsbEhvb2sgPSAoaG9vaywgYXJncykgPT4ge1xuICAgIGhvb2sgJiYgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoXG4gICAgICBob29rLFxuICAgICAgaW5zdGFuY2UsXG4gICAgICA5LFxuICAgICAgYXJnc1xuICAgICk7XG4gIH07XG4gIGNvbnN0IGNhbGxBc3luY0hvb2sgPSAoaG9vaywgYXJncykgPT4ge1xuICAgIGNvbnN0IGRvbmUgPSBhcmdzWzFdO1xuICAgIGNhbGxIb29rKGhvb2ssIGFyZ3MpO1xuICAgIGlmIChpc0FycmF5KGhvb2spKSB7XG4gICAgICBpZiAoaG9vay5ldmVyeSgoaG9vazIpID0+IGhvb2syLmxlbmd0aCA8PSAxKSlcbiAgICAgICAgZG9uZSgpO1xuICAgIH0gZWxzZSBpZiAoaG9vay5sZW5ndGggPD0gMSkge1xuICAgICAgZG9uZSgpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaG9va3MgPSB7XG4gICAgbW9kZSxcbiAgICBwZXJzaXN0ZWQsXG4gICAgYmVmb3JlRW50ZXIoZWwpIHtcbiAgICAgIGxldCBob29rID0gb25CZWZvcmVFbnRlcjtcbiAgICAgIGlmICghc3RhdGUuaXNNb3VudGVkKSB7XG4gICAgICAgIGlmIChhcHBlYXIpIHtcbiAgICAgICAgICBob29rID0gb25CZWZvcmVBcHBlYXIgfHwgb25CZWZvcmVFbnRlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChlbC5fbGVhdmVDYikge1xuICAgICAgICBlbC5fbGVhdmVDYihcbiAgICAgICAgICB0cnVlXG4gICAgICAgICAgLyogY2FuY2VsbGVkICovXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjb25zdCBsZWF2aW5nVk5vZGUgPSBsZWF2aW5nVk5vZGVzQ2FjaGVba2V5XTtcbiAgICAgIGlmIChsZWF2aW5nVk5vZGUgJiYgaXNTYW1lVk5vZGVUeXBlKHZub2RlLCBsZWF2aW5nVk5vZGUpICYmIGxlYXZpbmdWTm9kZS5lbC5fbGVhdmVDYikge1xuICAgICAgICBsZWF2aW5nVk5vZGUuZWwuX2xlYXZlQ2IoKTtcbiAgICAgIH1cbiAgICAgIGNhbGxIb29rKGhvb2ssIFtlbF0pO1xuICAgIH0sXG4gICAgZW50ZXIoZWwpIHtcbiAgICAgIGxldCBob29rID0gb25FbnRlcjtcbiAgICAgIGxldCBhZnRlckhvb2sgPSBvbkFmdGVyRW50ZXI7XG4gICAgICBsZXQgY2FuY2VsSG9vayA9IG9uRW50ZXJDYW5jZWxsZWQ7XG4gICAgICBpZiAoIXN0YXRlLmlzTW91bnRlZCkge1xuICAgICAgICBpZiAoYXBwZWFyKSB7XG4gICAgICAgICAgaG9vayA9IG9uQXBwZWFyIHx8IG9uRW50ZXI7XG4gICAgICAgICAgYWZ0ZXJIb29rID0gb25BZnRlckFwcGVhciB8fCBvbkFmdGVyRW50ZXI7XG4gICAgICAgICAgY2FuY2VsSG9vayA9IG9uQXBwZWFyQ2FuY2VsbGVkIHx8IG9uRW50ZXJDYW5jZWxsZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgY2FsbGVkID0gZmFsc2U7XG4gICAgICBjb25zdCBkb25lID0gZWwuX2VudGVyQ2IgPSAoY2FuY2VsbGVkKSA9PiB7XG4gICAgICAgIGlmIChjYWxsZWQpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICBpZiAoY2FuY2VsbGVkKSB7XG4gICAgICAgICAgY2FsbEhvb2soY2FuY2VsSG9vaywgW2VsXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbEhvb2soYWZ0ZXJIb29rLCBbZWxdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va3MuZGVsYXllZExlYXZlKSB7XG4gICAgICAgICAgaG9va3MuZGVsYXllZExlYXZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWwuX2VudGVyQ2IgPSB2b2lkIDA7XG4gICAgICB9O1xuICAgICAgaWYgKGhvb2spIHtcbiAgICAgICAgY2FsbEFzeW5jSG9vayhob29rLCBbZWwsIGRvbmVdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxlYXZlKGVsLCByZW1vdmUpIHtcbiAgICAgIGNvbnN0IGtleTIgPSBTdHJpbmcodm5vZGUua2V5KTtcbiAgICAgIGlmIChlbC5fZW50ZXJDYikge1xuICAgICAgICBlbC5fZW50ZXJDYihcbiAgICAgICAgICB0cnVlXG4gICAgICAgICAgLyogY2FuY2VsbGVkICovXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUuaXNVbm1vdW50aW5nKSB7XG4gICAgICAgIHJldHVybiByZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGNhbGxIb29rKG9uQmVmb3JlTGVhdmUsIFtlbF0pO1xuICAgICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgZG9uZSA9IGVsLl9sZWF2ZUNiID0gKGNhbmNlbGxlZCkgPT4ge1xuICAgICAgICBpZiAoY2FsbGVkKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHtcbiAgICAgICAgICBjYWxsSG9vayhvbkxlYXZlQ2FuY2VsbGVkLCBbZWxdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsSG9vayhvbkFmdGVyTGVhdmUsIFtlbF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsLl9sZWF2ZUNiID0gdm9pZCAwO1xuICAgICAgICBpZiAobGVhdmluZ1ZOb2Rlc0NhY2hlW2tleTJdID09PSB2bm9kZSkge1xuICAgICAgICAgIGRlbGV0ZSBsZWF2aW5nVk5vZGVzQ2FjaGVba2V5Ml07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBsZWF2aW5nVk5vZGVzQ2FjaGVba2V5Ml0gPSB2bm9kZTtcbiAgICAgIGlmIChvbkxlYXZlKSB7XG4gICAgICAgIGNhbGxBc3luY0hvb2sob25MZWF2ZSwgW2VsLCBkb25lXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbG9uZSh2bm9kZTIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKHZub2RlMiwgcHJvcHMsIHN0YXRlLCBpbnN0YW5jZSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gaG9va3M7XG59XG5mdW5jdGlvbiBlbXB0eVBsYWNlaG9sZGVyKHZub2RlKSB7XG4gIGlmIChpc0tlZXBBbGl2ZSh2bm9kZSkpIHtcbiAgICB2bm9kZSA9IGNsb25lVk5vZGUodm5vZGUpO1xuICAgIHZub2RlLmNoaWxkcmVuID0gbnVsbDtcbiAgICByZXR1cm4gdm5vZGU7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEtlZXBBbGl2ZUNoaWxkKHZub2RlKSB7XG4gIHJldHVybiBpc0tlZXBBbGl2ZSh2bm9kZSkgPyB2bm9kZS5jaGlsZHJlbiA/IHZub2RlLmNoaWxkcmVuWzBdIDogdm9pZCAwIDogdm5vZGU7XG59XG5mdW5jdGlvbiBzZXRUcmFuc2l0aW9uSG9va3Modm5vZGUsIGhvb2tzKSB7XG4gIGlmICh2bm9kZS5zaGFwZUZsYWcgJiA2ICYmIHZub2RlLmNvbXBvbmVudCkge1xuICAgIHNldFRyYW5zaXRpb25Ib29rcyh2bm9kZS5jb21wb25lbnQuc3ViVHJlZSwgaG9va3MpO1xuICB9IGVsc2UgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDEyOCkge1xuICAgIHZub2RlLnNzQ29udGVudC50cmFuc2l0aW9uID0gaG9va3MuY2xvbmUodm5vZGUuc3NDb250ZW50KTtcbiAgICB2bm9kZS5zc0ZhbGxiYWNrLnRyYW5zaXRpb24gPSBob29rcy5jbG9uZSh2bm9kZS5zc0ZhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB2bm9kZS50cmFuc2l0aW9uID0gaG9va3M7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbihjaGlsZHJlbiwga2VlcENvbW1lbnQgPSBmYWxzZSwgcGFyZW50S2V5KSB7XG4gIGxldCByZXQgPSBbXTtcbiAgbGV0IGtleWVkRnJhZ21lbnRDb3VudCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICBjb25zdCBrZXkgPSBwYXJlbnRLZXkgPT0gbnVsbCA/IGNoaWxkLmtleSA6IFN0cmluZyhwYXJlbnRLZXkpICsgU3RyaW5nKGNoaWxkLmtleSAhPSBudWxsID8gY2hpbGQua2V5IDogaSk7XG4gICAgaWYgKGNoaWxkLnR5cGUgPT09IEZyYWdtZW50KSB7XG4gICAgICBpZiAoY2hpbGQucGF0Y2hGbGFnICYgMTI4KVxuICAgICAgICBrZXllZEZyYWdtZW50Q291bnQrKztcbiAgICAgIHJldCA9IHJldC5jb25jYXQoXG4gICAgICAgIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwga2VlcENvbW1lbnQsIGtleSlcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChrZWVwQ29tbWVudCB8fCBjaGlsZC50eXBlICE9PSBDb21tZW50KSB7XG4gICAgICByZXQucHVzaChrZXkgIT0gbnVsbCA/IGNsb25lVk5vZGUoY2hpbGQsIHsga2V5IH0pIDogY2hpbGQpO1xuICAgIH1cbiAgfVxuICBpZiAoa2V5ZWRGcmFnbWVudENvdW50ID4gMSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXRbaV0ucGF0Y2hGbGFnID0gLTI7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUNvbXBvbmVudChvcHRpb25zLCBleHRyYU9wdGlvbnMpIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24ob3B0aW9ucykgPyAoXG4gICAgLy8gIzgzMjY6IGV4dGVuZCBjYWxsIGFuZCBvcHRpb25zLm5hbWUgYWNjZXNzIGFyZSBjb25zaWRlcmVkIHNpZGUtZWZmZWN0c1xuICAgIC8vIGJ5IFJvbGx1cCwgc28gd2UgaGF2ZSB0byB3cmFwIGl0IGluIGEgcHVyZS1hbm5vdGF0ZWQgSUlGRS5cbiAgICAvKiBAX19QVVJFX18gKi8gKCgpID0+IGV4dGVuZCh7IG5hbWU6IG9wdGlvbnMubmFtZSB9LCBleHRyYU9wdGlvbnMsIHsgc2V0dXA6IG9wdGlvbnMgfSkpKClcbiAgKSA6IG9wdGlvbnM7XG59XG5cbmNvbnN0IGlzQXN5bmNXcmFwcGVyID0gKGkpID0+ICEhaS50eXBlLl9fYXN5bmNMb2FkZXI7XG5mdW5jdGlvbiBkZWZpbmVBc3luY0NvbXBvbmVudChzb3VyY2UpIHtcbiAgaWYgKGlzRnVuY3Rpb24oc291cmNlKSkge1xuICAgIHNvdXJjZSA9IHsgbG9hZGVyOiBzb3VyY2UgfTtcbiAgfVxuICBjb25zdCB7XG4gICAgbG9hZGVyLFxuICAgIGxvYWRpbmdDb21wb25lbnQsXG4gICAgZXJyb3JDb21wb25lbnQsXG4gICAgZGVsYXkgPSAyMDAsXG4gICAgdGltZW91dCxcbiAgICAvLyB1bmRlZmluZWQgPSBuZXZlciB0aW1lcyBvdXRcbiAgICBzdXNwZW5zaWJsZSA9IHRydWUsXG4gICAgb25FcnJvcjogdXNlck9uRXJyb3JcbiAgfSA9IHNvdXJjZTtcbiAgbGV0IHBlbmRpbmdSZXF1ZXN0ID0gbnVsbDtcbiAgbGV0IHJlc29sdmVkQ29tcDtcbiAgbGV0IHJldHJpZXMgPSAwO1xuICBjb25zdCByZXRyeSA9ICgpID0+IHtcbiAgICByZXRyaWVzKys7XG4gICAgcGVuZGluZ1JlcXVlc3QgPSBudWxsO1xuICAgIHJldHVybiBsb2FkKCk7XG4gIH07XG4gIGNvbnN0IGxvYWQgPSAoKSA9PiB7XG4gICAgbGV0IHRoaXNSZXF1ZXN0O1xuICAgIHJldHVybiBwZW5kaW5nUmVxdWVzdCB8fCAodGhpc1JlcXVlc3QgPSBwZW5kaW5nUmVxdWVzdCA9IGxvYWRlcigpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGVyciA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyIDogbmV3IEVycm9yKFN0cmluZyhlcnIpKTtcbiAgICAgIGlmICh1c2VyT25FcnJvcikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVzZXJSZXRyeSA9ICgpID0+IHJlc29sdmUocmV0cnkoKSk7XG4gICAgICAgICAgY29uc3QgdXNlckZhaWwgPSAoKSA9PiByZWplY3QoZXJyKTtcbiAgICAgICAgICB1c2VyT25FcnJvcihlcnIsIHVzZXJSZXRyeSwgdXNlckZhaWwsIHJldHJpZXMgKyAxKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSkudGhlbigoY29tcCkgPT4ge1xuICAgICAgaWYgKHRoaXNSZXF1ZXN0ICE9PSBwZW5kaW5nUmVxdWVzdCAmJiBwZW5kaW5nUmVxdWVzdCkge1xuICAgICAgICByZXR1cm4gcGVuZGluZ1JlcXVlc3Q7XG4gICAgICB9XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhY29tcCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIGBBc3luYyBjb21wb25lbnQgbG9hZGVyIHJlc29sdmVkIHRvIHVuZGVmaW5lZC4gSWYgeW91IGFyZSB1c2luZyByZXRyeSgpLCBtYWtlIHN1cmUgdG8gcmV0dXJuIGl0cyByZXR1cm4gdmFsdWUuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbXAgJiYgKGNvbXAuX19lc01vZHVsZSB8fCBjb21wW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09IFwiTW9kdWxlXCIpKSB7XG4gICAgICAgIGNvbXAgPSBjb21wLmRlZmF1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBjb21wICYmICFpc09iamVjdChjb21wKSAmJiAhaXNGdW5jdGlvbihjb21wKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXN5bmMgY29tcG9uZW50IGxvYWQgcmVzdWx0OiAke2NvbXB9YCk7XG4gICAgICB9XG4gICAgICByZXNvbHZlZENvbXAgPSBjb21wO1xuICAgICAgcmV0dXJuIGNvbXA7XG4gICAgfSkpO1xuICB9O1xuICByZXR1cm4gZGVmaW5lQ29tcG9uZW50KHtcbiAgICBuYW1lOiBcIkFzeW5jQ29tcG9uZW50V3JhcHBlclwiLFxuICAgIF9fYXN5bmNMb2FkZXI6IGxvYWQsXG4gICAgZ2V0IF9fYXN5bmNSZXNvbHZlZCgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZENvbXA7XG4gICAgfSxcbiAgICBzZXR1cCgpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gY3VycmVudEluc3RhbmNlO1xuICAgICAgaWYgKHJlc29sdmVkQ29tcCkge1xuICAgICAgICByZXR1cm4gKCkgPT4gY3JlYXRlSW5uZXJDb21wKHJlc29sdmVkQ29tcCwgaW5zdGFuY2UpO1xuICAgICAgfVxuICAgICAgY29uc3Qgb25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlcXVlc3QgPSBudWxsO1xuICAgICAgICBoYW5kbGVFcnJvcihcbiAgICAgICAgICBlcnIsXG4gICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgMTMsXG4gICAgICAgICAgIWVycm9yQ29tcG9uZW50XG4gICAgICAgICAgLyogZG8gbm90IHRocm93IGluIGRldiBpZiB1c2VyIHByb3ZpZGVkIGVycm9yIGNvbXBvbmVudCAqL1xuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgIGlmIChzdXNwZW5zaWJsZSAmJiBpbnN0YW5jZS5zdXNwZW5zZSB8fCBpc0luU1NSQ29tcG9uZW50U2V0dXApIHtcbiAgICAgICAgcmV0dXJuIGxvYWQoKS50aGVuKChjb21wKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IGNyZWF0ZUlubmVyQ29tcChjb21wLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuICgpID0+IGVycm9yQ29tcG9uZW50ID8gY3JlYXRlVk5vZGUoZXJyb3JDb21wb25lbnQsIHtcbiAgICAgICAgICAgIGVycm9yOiBlcnJcbiAgICAgICAgICB9KSA6IG51bGw7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgbG9hZGVkID0gcmVmKGZhbHNlKTtcbiAgICAgIGNvbnN0IGVycm9yID0gcmVmKCk7XG4gICAgICBjb25zdCBkZWxheWVkID0gcmVmKCEhZGVsYXkpO1xuICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRlbGF5ZWQudmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoIWxvYWRlZC52YWx1ZSAmJiAhZXJyb3IudmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYEFzeW5jIGNvbXBvbmVudCB0aW1lZCBvdXQgYWZ0ZXIgJHt0aW1lb3V0fW1zLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgICBlcnJvci52YWx1ZSA9IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgbG9hZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBsb2FkZWQudmFsdWUgPSB0cnVlO1xuICAgICAgICBpZiAoaW5zdGFuY2UucGFyZW50ICYmIGlzS2VlcEFsaXZlKGluc3RhbmNlLnBhcmVudC52bm9kZSkpIHtcbiAgICAgICAgICBxdWV1ZUpvYihpbnN0YW5jZS5wYXJlbnQudXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgIGVycm9yLnZhbHVlID0gZXJyO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAobG9hZGVkLnZhbHVlICYmIHJlc29sdmVkQ29tcCkge1xuICAgICAgICAgIHJldHVybiBjcmVhdGVJbm5lckNvbXAocmVzb2x2ZWRDb21wLCBpbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IudmFsdWUgJiYgZXJyb3JDb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUoZXJyb3JDb21wb25lbnQsIHtcbiAgICAgICAgICAgIGVycm9yOiBlcnJvci52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvYWRpbmdDb21wb25lbnQgJiYgIWRlbGF5ZWQudmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gY3JlYXRlVk5vZGUobG9hZGluZ0NvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUlubmVyQ29tcChjb21wLCBwYXJlbnQpIHtcbiAgY29uc3QgeyByZWY6IHJlZjIsIHByb3BzLCBjaGlsZHJlbiwgY2UgfSA9IHBhcmVudC52bm9kZTtcbiAgY29uc3Qgdm5vZGUgPSBjcmVhdGVWTm9kZShjb21wLCBwcm9wcywgY2hpbGRyZW4pO1xuICB2bm9kZS5yZWYgPSByZWYyO1xuICB2bm9kZS5jZSA9IGNlO1xuICBkZWxldGUgcGFyZW50LnZub2RlLmNlO1xuICByZXR1cm4gdm5vZGU7XG59XG5cbmNvbnN0IGlzS2VlcEFsaXZlID0gKHZub2RlKSA9PiB2bm9kZS50eXBlLl9faXNLZWVwQWxpdmU7XG5jb25zdCBLZWVwQWxpdmVJbXBsID0ge1xuICBuYW1lOiBgS2VlcEFsaXZlYCxcbiAgLy8gTWFya2VyIGZvciBzcGVjaWFsIGhhbmRsaW5nIGluc2lkZSB0aGUgcmVuZGVyZXIuIFdlIGFyZSBub3QgdXNpbmcgYSA9PT1cbiAgLy8gY2hlY2sgZGlyZWN0bHkgb24gS2VlcEFsaXZlIGluIHRoZSByZW5kZXJlciwgYmVjYXVzZSBpbXBvcnRpbmcgaXQgZGlyZWN0bHlcbiAgLy8gd291bGQgcHJldmVudCBpdCBmcm9tIGJlaW5nIHRyZWUtc2hha2VuLlxuICBfX2lzS2VlcEFsaXZlOiB0cnVlLFxuICBwcm9wczoge1xuICAgIGluY2x1ZGU6IFtTdHJpbmcsIFJlZ0V4cCwgQXJyYXldLFxuICAgIGV4Y2x1ZGU6IFtTdHJpbmcsIFJlZ0V4cCwgQXJyYXldLFxuICAgIG1heDogW1N0cmluZywgTnVtYmVyXVxuICB9LFxuICBzZXR1cChwcm9wcywgeyBzbG90cyB9KSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcbiAgICBjb25zdCBzaGFyZWRDb250ZXh0ID0gaW5zdGFuY2UuY3R4O1xuICAgIGlmICghc2hhcmVkQ29udGV4dC5yZW5kZXJlcikge1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzbG90cy5kZWZhdWx0ICYmIHNsb3RzLmRlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSA/IGNoaWxkcmVuWzBdIDogY2hpbGRyZW47XG4gICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBjYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gICAgY29uc3Qga2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gICAgbGV0IGN1cnJlbnQgPSBudWxsO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgICAgaW5zdGFuY2UuX192X2NhY2hlID0gY2FjaGU7XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudFN1c3BlbnNlID0gaW5zdGFuY2Uuc3VzcGVuc2U7XG4gICAgY29uc3Qge1xuICAgICAgcmVuZGVyZXI6IHtcbiAgICAgICAgcDogcGF0Y2gsXG4gICAgICAgIG06IG1vdmUsXG4gICAgICAgIHVtOiBfdW5tb3VudCxcbiAgICAgICAgbzogeyBjcmVhdGVFbGVtZW50IH1cbiAgICAgIH1cbiAgICB9ID0gc2hhcmVkQ29udGV4dDtcbiAgICBjb25zdCBzdG9yYWdlQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBzaGFyZWRDb250ZXh0LmFjdGl2YXRlID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xuICAgICAgY29uc3QgaW5zdGFuY2UyID0gdm5vZGUuY29tcG9uZW50O1xuICAgICAgbW92ZSh2bm9kZSwgY29udGFpbmVyLCBhbmNob3IsIDAsIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIHBhdGNoKFxuICAgICAgICBpbnN0YW5jZTIudm5vZGUsXG4gICAgICAgIHZub2RlLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgaW5zdGFuY2UyLFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHZub2RlLnNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkXG4gICAgICApO1xuICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaW5zdGFuY2UyLmlzRGVhY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGluc3RhbmNlMi5hKSB7XG4gICAgICAgICAgaW52b2tlQXJyYXlGbnMoaW5zdGFuY2UyLmEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZub2RlSG9vayA9IHZub2RlLnByb3BzICYmIHZub2RlLnByb3BzLm9uVm5vZGVNb3VudGVkO1xuICAgICAgICBpZiAodm5vZGVIb29rKSB7XG4gICAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgaW5zdGFuY2UyLnBhcmVudCwgdm5vZGUpO1xuICAgICAgICB9XG4gICAgICB9LCBwYXJlbnRTdXNwZW5zZSk7XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB8fCBfX1ZVRV9QUk9EX0RFVlRPT0xTX18pIHtcbiAgICAgICAgZGV2dG9vbHNDb21wb25lbnRBZGRlZChpbnN0YW5jZTIpO1xuICAgICAgfVxuICAgIH07XG4gICAgc2hhcmVkQ29udGV4dC5kZWFjdGl2YXRlID0gKHZub2RlKSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZTIgPSB2bm9kZS5jb21wb25lbnQ7XG4gICAgICBtb3ZlKHZub2RlLCBzdG9yYWdlQ29udGFpbmVyLCBudWxsLCAxLCBwYXJlbnRTdXNwZW5zZSk7XG4gICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoaW5zdGFuY2UyLmRhKSB7XG4gICAgICAgICAgaW52b2tlQXJyYXlGbnMoaW5zdGFuY2UyLmRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2bm9kZUhvb2sgPSB2bm9kZS5wcm9wcyAmJiB2bm9kZS5wcm9wcy5vblZub2RlVW5tb3VudGVkO1xuICAgICAgICBpZiAodm5vZGVIb29rKSB7XG4gICAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgaW5zdGFuY2UyLnBhcmVudCwgdm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGluc3RhbmNlMi5pc0RlYWN0aXZhdGVkID0gdHJ1ZTtcbiAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgICAgICBkZXZ0b29sc0NvbXBvbmVudEFkZGVkKGluc3RhbmNlMik7XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiB1bm1vdW50KHZub2RlKSB7XG4gICAgICByZXNldFNoYXBlRmxhZyh2bm9kZSk7XG4gICAgICBfdW5tb3VudCh2bm9kZSwgaW5zdGFuY2UsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJ1bmVDYWNoZShmaWx0ZXIpIHtcbiAgICAgIGNhY2hlLmZvckVhY2goKHZub2RlLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodm5vZGUudHlwZSk7XG4gICAgICAgIGlmIChuYW1lICYmICghZmlsdGVyIHx8ICFmaWx0ZXIobmFtZSkpKSB7XG4gICAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcnVuZUNhY2hlRW50cnkoa2V5KSB7XG4gICAgICBjb25zdCBjYWNoZWQgPSBjYWNoZS5nZXQoa2V5KTtcbiAgICAgIGlmICghY3VycmVudCB8fCAhaXNTYW1lVk5vZGVUeXBlKGNhY2hlZCwgY3VycmVudCkpIHtcbiAgICAgICAgdW5tb3VudChjYWNoZWQpO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50KSB7XG4gICAgICAgIHJlc2V0U2hhcGVGbGFnKGN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgY2FjaGUuZGVsZXRlKGtleSk7XG4gICAgICBrZXlzLmRlbGV0ZShrZXkpO1xuICAgIH1cbiAgICB3YXRjaChcbiAgICAgICgpID0+IFtwcm9wcy5pbmNsdWRlLCBwcm9wcy5leGNsdWRlXSxcbiAgICAgIChbaW5jbHVkZSwgZXhjbHVkZV0pID0+IHtcbiAgICAgICAgaW5jbHVkZSAmJiBwcnVuZUNhY2hlKChuYW1lKSA9PiBtYXRjaGVzKGluY2x1ZGUsIG5hbWUpKTtcbiAgICAgICAgZXhjbHVkZSAmJiBwcnVuZUNhY2hlKChuYW1lKSA9PiAhbWF0Y2hlcyhleGNsdWRlLCBuYW1lKSk7XG4gICAgICB9LFxuICAgICAgLy8gcHJ1bmUgcG9zdC1yZW5kZXIgYWZ0ZXIgYGN1cnJlbnRgIGhhcyBiZWVuIHVwZGF0ZWRcbiAgICAgIHsgZmx1c2g6IFwicG9zdFwiLCBkZWVwOiB0cnVlIH1cbiAgICApO1xuICAgIGxldCBwZW5kaW5nQ2FjaGVLZXkgPSBudWxsO1xuICAgIGNvbnN0IGNhY2hlU3VidHJlZSA9ICgpID0+IHtcbiAgICAgIGlmIChwZW5kaW5nQ2FjaGVLZXkgIT0gbnVsbCkge1xuICAgICAgICBjYWNoZS5zZXQocGVuZGluZ0NhY2hlS2V5LCBnZXRJbm5lckNoaWxkKGluc3RhbmNlLnN1YlRyZWUpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIG9uTW91bnRlZChjYWNoZVN1YnRyZWUpO1xuICAgIG9uVXBkYXRlZChjYWNoZVN1YnRyZWUpO1xuICAgIG9uQmVmb3JlVW5tb3VudCgoKSA9PiB7XG4gICAgICBjYWNoZS5mb3JFYWNoKChjYWNoZWQpID0+IHtcbiAgICAgICAgY29uc3QgeyBzdWJUcmVlLCBzdXNwZW5zZSB9ID0gaW5zdGFuY2U7XG4gICAgICAgIGNvbnN0IHZub2RlID0gZ2V0SW5uZXJDaGlsZChzdWJUcmVlKTtcbiAgICAgICAgaWYgKGNhY2hlZC50eXBlID09PSB2bm9kZS50eXBlICYmIGNhY2hlZC5rZXkgPT09IHZub2RlLmtleSkge1xuICAgICAgICAgIHJlc2V0U2hhcGVGbGFnKHZub2RlKTtcbiAgICAgICAgICBjb25zdCBkYSA9IHZub2RlLmNvbXBvbmVudC5kYTtcbiAgICAgICAgICBkYSAmJiBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoZGEsIHN1c3BlbnNlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdW5tb3VudChjYWNoZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHBlbmRpbmdDYWNoZUtleSA9IG51bGw7XG4gICAgICBpZiAoIXNsb3RzLmRlZmF1bHQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHNsb3RzLmRlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHJhd1ZOb2RlID0gY2hpbGRyZW5bMF07XG4gICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHdhcm4oYEtlZXBBbGl2ZSBzaG91bGQgY29udGFpbiBleGFjdGx5IG9uZSBjb21wb25lbnQgY2hpbGQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IG51bGw7XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIH0gZWxzZSBpZiAoIWlzVk5vZGUocmF3Vk5vZGUpIHx8ICEocmF3Vk5vZGUuc2hhcGVGbGFnICYgNCkgJiYgIShyYXdWTm9kZS5zaGFwZUZsYWcgJiAxMjgpKSB7XG4gICAgICAgIGN1cnJlbnQgPSBudWxsO1xuICAgICAgICByZXR1cm4gcmF3Vk5vZGU7XG4gICAgICB9XG4gICAgICBsZXQgdm5vZGUgPSBnZXRJbm5lckNoaWxkKHJhd1ZOb2RlKTtcbiAgICAgIGNvbnN0IGNvbXAgPSB2bm9kZS50eXBlO1xuICAgICAgY29uc3QgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoXG4gICAgICAgIGlzQXN5bmNXcmFwcGVyKHZub2RlKSA/IHZub2RlLnR5cGUuX19hc3luY1Jlc29sdmVkIHx8IHt9IDogY29tcFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHsgaW5jbHVkZSwgZXhjbHVkZSwgbWF4IH0gPSBwcm9wcztcbiAgICAgIGlmIChpbmNsdWRlICYmICghbmFtZSB8fCAhbWF0Y2hlcyhpbmNsdWRlLCBuYW1lKSkgfHwgZXhjbHVkZSAmJiBuYW1lICYmIG1hdGNoZXMoZXhjbHVkZSwgbmFtZSkpIHtcbiAgICAgICAgY3VycmVudCA9IHZub2RlO1xuICAgICAgICByZXR1cm4gcmF3Vk5vZGU7XG4gICAgICB9XG4gICAgICBjb25zdCBrZXkgPSB2bm9kZS5rZXkgPT0gbnVsbCA/IGNvbXAgOiB2bm9kZS5rZXk7XG4gICAgICBjb25zdCBjYWNoZWRWTm9kZSA9IGNhY2hlLmdldChrZXkpO1xuICAgICAgaWYgKHZub2RlLmVsKSB7XG4gICAgICAgIHZub2RlID0gY2xvbmVWTm9kZSh2bm9kZSk7XG4gICAgICAgIGlmIChyYXdWTm9kZS5zaGFwZUZsYWcgJiAxMjgpIHtcbiAgICAgICAgICByYXdWTm9kZS5zc0NvbnRlbnQgPSB2bm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcGVuZGluZ0NhY2hlS2V5ID0ga2V5O1xuICAgICAgaWYgKGNhY2hlZFZOb2RlKSB7XG4gICAgICAgIHZub2RlLmVsID0gY2FjaGVkVk5vZGUuZWw7XG4gICAgICAgIHZub2RlLmNvbXBvbmVudCA9IGNhY2hlZFZOb2RlLmNvbXBvbmVudDtcbiAgICAgICAgaWYgKHZub2RlLnRyYW5zaXRpb24pIHtcbiAgICAgICAgICBzZXRUcmFuc2l0aW9uSG9va3Modm5vZGUsIHZub2RlLnRyYW5zaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHZub2RlLnNoYXBlRmxhZyB8PSA1MTI7XG4gICAgICAgIGtleXMuZGVsZXRlKGtleSk7XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgICAgICBpZiAobWF4ICYmIGtleXMuc2l6ZSA+IHBhcnNlSW50KG1heCwgMTApKSB7XG4gICAgICAgICAgcHJ1bmVDYWNoZUVudHJ5KGtleXMudmFsdWVzKCkubmV4dCgpLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdm5vZGUuc2hhcGVGbGFnIHw9IDI1NjtcbiAgICAgIGN1cnJlbnQgPSB2bm9kZTtcbiAgICAgIHJldHVybiBpc1N1c3BlbnNlKHJhd1ZOb2RlLnR5cGUpID8gcmF3Vk5vZGUgOiB2bm9kZTtcbiAgICB9O1xuICB9XG59O1xuY29uc3QgS2VlcEFsaXZlID0gS2VlcEFsaXZlSW1wbDtcbmZ1bmN0aW9uIG1hdGNoZXMocGF0dGVybiwgbmFtZSkge1xuICBpZiAoaXNBcnJheShwYXR0ZXJuKSkge1xuICAgIHJldHVybiBwYXR0ZXJuLnNvbWUoKHApID0+IG1hdGNoZXMocCwgbmFtZSkpO1xuICB9IGVsc2UgaWYgKGlzU3RyaW5nKHBhdHRlcm4pKSB7XG4gICAgcmV0dXJuIHBhdHRlcm4uc3BsaXQoXCIsXCIpLmluY2x1ZGVzKG5hbWUpO1xuICB9IGVsc2UgaWYgKGlzUmVnRXhwKHBhdHRlcm4pKSB7XG4gICAgcmV0dXJuIHBhdHRlcm4udGVzdChuYW1lKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBvbkFjdGl2YXRlZChob29rLCB0YXJnZXQpIHtcbiAgcmVnaXN0ZXJLZWVwQWxpdmVIb29rKGhvb2ssIFwiYVwiLCB0YXJnZXQpO1xufVxuZnVuY3Rpb24gb25EZWFjdGl2YXRlZChob29rLCB0YXJnZXQpIHtcbiAgcmVnaXN0ZXJLZWVwQWxpdmVIb29rKGhvb2ssIFwiZGFcIiwgdGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyS2VlcEFsaXZlSG9vayhob29rLCB0eXBlLCB0YXJnZXQgPSBjdXJyZW50SW5zdGFuY2UpIHtcbiAgY29uc3Qgd3JhcHBlZEhvb2sgPSBob29rLl9fd2RjIHx8IChob29rLl9fd2RjID0gKCkgPT4ge1xuICAgIGxldCBjdXJyZW50ID0gdGFyZ2V0O1xuICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICBpZiAoY3VycmVudC5pc0RlYWN0aXZhdGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIGhvb2soKTtcbiAgfSk7XG4gIGluamVjdEhvb2sodHlwZSwgd3JhcHBlZEhvb2ssIHRhcmdldCk7XG4gIGlmICh0YXJnZXQpIHtcbiAgICBsZXQgY3VycmVudCA9IHRhcmdldC5wYXJlbnQ7XG4gICAgd2hpbGUgKGN1cnJlbnQgJiYgY3VycmVudC5wYXJlbnQpIHtcbiAgICAgIGlmIChpc0tlZXBBbGl2ZShjdXJyZW50LnBhcmVudC52bm9kZSkpIHtcbiAgICAgICAgaW5qZWN0VG9LZWVwQWxpdmVSb290KHdyYXBwZWRIb29rLCB0eXBlLCB0YXJnZXQsIGN1cnJlbnQpO1xuICAgICAgfVxuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gaW5qZWN0VG9LZWVwQWxpdmVSb290KGhvb2ssIHR5cGUsIHRhcmdldCwga2VlcEFsaXZlUm9vdCkge1xuICBjb25zdCBpbmplY3RlZCA9IGluamVjdEhvb2soXG4gICAgdHlwZSxcbiAgICBob29rLFxuICAgIGtlZXBBbGl2ZVJvb3QsXG4gICAgdHJ1ZVxuICAgIC8qIHByZXBlbmQgKi9cbiAgKTtcbiAgb25Vbm1vdW50ZWQoKCkgPT4ge1xuICAgIHJlbW92ZShrZWVwQWxpdmVSb290W3R5cGVdLCBpbmplY3RlZCk7XG4gIH0sIHRhcmdldCk7XG59XG5mdW5jdGlvbiByZXNldFNoYXBlRmxhZyh2bm9kZSkge1xuICB2bm9kZS5zaGFwZUZsYWcgJj0gfjI1NjtcbiAgdm5vZGUuc2hhcGVGbGFnICY9IH41MTI7XG59XG5mdW5jdGlvbiBnZXRJbm5lckNoaWxkKHZub2RlKSB7XG4gIHJldHVybiB2bm9kZS5zaGFwZUZsYWcgJiAxMjggPyB2bm9kZS5zc0NvbnRlbnQgOiB2bm9kZTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0SG9vayh0eXBlLCBob29rLCB0YXJnZXQgPSBjdXJyZW50SW5zdGFuY2UsIHByZXBlbmQgPSBmYWxzZSkge1xuICBpZiAodGFyZ2V0KSB7XG4gICAgY29uc3QgaG9va3MgPSB0YXJnZXRbdHlwZV0gfHwgKHRhcmdldFt0eXBlXSA9IFtdKTtcbiAgICBjb25zdCB3cmFwcGVkSG9vayA9IGhvb2suX193ZWggfHwgKGhvb2suX193ZWggPSAoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRhcmdldC5pc1VubW91bnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBwYXVzZVRyYWNraW5nKCk7XG4gICAgICBzZXRDdXJyZW50SW5zdGFuY2UodGFyZ2V0KTtcbiAgICAgIGNvbnN0IHJlcyA9IGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKGhvb2ssIHRhcmdldCwgdHlwZSwgYXJncyk7XG4gICAgICB1bnNldEN1cnJlbnRJbnN0YW5jZSgpO1xuICAgICAgcmVzZXRUcmFja2luZygpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcbiAgICBpZiAocHJlcGVuZCkge1xuICAgICAgaG9va3MudW5zaGlmdCh3cmFwcGVkSG9vayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvb2tzLnB1c2god3JhcHBlZEhvb2spO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcHBlZEhvb2s7XG4gIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIGNvbnN0IGFwaU5hbWUgPSB0b0hhbmRsZXJLZXkoRXJyb3JUeXBlU3RyaW5nc1t0eXBlXS5yZXBsYWNlKC8gaG9vayQvLCBcIlwiKSk7XG4gICAgd2FybihcbiAgICAgIGAke2FwaU5hbWV9IGlzIGNhbGxlZCB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjb21wb25lbnQgaW5zdGFuY2UgdG8gYmUgYXNzb2NpYXRlZCB3aXRoLiBMaWZlY3ljbGUgaW5qZWN0aW9uIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBkdXJpbmcgZXhlY3V0aW9uIG9mIHNldHVwKCkuYCArIChgIElmIHlvdSBhcmUgdXNpbmcgYXN5bmMgc2V0dXAoKSwgbWFrZSBzdXJlIHRvIHJlZ2lzdGVyIGxpZmVjeWNsZSBob29rcyBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0IHN0YXRlbWVudC5gIClcbiAgICApO1xuICB9XG59XG5jb25zdCBjcmVhdGVIb29rID0gKGxpZmVjeWNsZSkgPT4gKGhvb2ssIHRhcmdldCA9IGN1cnJlbnRJbnN0YW5jZSkgPT4gKFxuICAvLyBwb3N0LWNyZWF0ZSBsaWZlY3ljbGUgcmVnaXN0cmF0aW9ucyBhcmUgbm9vcHMgZHVyaW5nIFNTUiAoZXhjZXB0IGZvciBzZXJ2ZXJQcmVmZXRjaClcbiAgKCFpc0luU1NSQ29tcG9uZW50U2V0dXAgfHwgbGlmZWN5Y2xlID09PSBcInNwXCIpICYmIGluamVjdEhvb2sobGlmZWN5Y2xlLCAoLi4uYXJncykgPT4gaG9vayguLi5hcmdzKSwgdGFyZ2V0KVxuKTtcbmNvbnN0IG9uQmVmb3JlTW91bnQgPSBjcmVhdGVIb29rKFwiYm1cIik7XG5jb25zdCBvbk1vdW50ZWQgPSBjcmVhdGVIb29rKFwibVwiKTtcbmNvbnN0IG9uQmVmb3JlVXBkYXRlID0gY3JlYXRlSG9vayhcImJ1XCIpO1xuY29uc3Qgb25VcGRhdGVkID0gY3JlYXRlSG9vayhcInVcIik7XG5jb25zdCBvbkJlZm9yZVVubW91bnQgPSBjcmVhdGVIb29rKFwiYnVtXCIpO1xuY29uc3Qgb25Vbm1vdW50ZWQgPSBjcmVhdGVIb29rKFwidW1cIik7XG5jb25zdCBvblNlcnZlclByZWZldGNoID0gY3JlYXRlSG9vayhcInNwXCIpO1xuY29uc3Qgb25SZW5kZXJUcmlnZ2VyZWQgPSBjcmVhdGVIb29rKFxuICBcInJ0Z1wiXG4pO1xuY29uc3Qgb25SZW5kZXJUcmFja2VkID0gY3JlYXRlSG9vayhcbiAgXCJydGNcIlxuKTtcbmZ1bmN0aW9uIG9uRXJyb3JDYXB0dXJlZChob29rLCB0YXJnZXQgPSBjdXJyZW50SW5zdGFuY2UpIHtcbiAgaW5qZWN0SG9vayhcImVjXCIsIGhvb2ssIHRhcmdldCk7XG59XG5cbmNvbnN0IENPTVBPTkVOVFMgPSBcImNvbXBvbmVudHNcIjtcbmNvbnN0IERJUkVDVElWRVMgPSBcImRpcmVjdGl2ZXNcIjtcbmZ1bmN0aW9uIHJlc29sdmVDb21wb25lbnQobmFtZSwgbWF5YmVTZWxmUmVmZXJlbmNlKSB7XG4gIHJldHVybiByZXNvbHZlQXNzZXQoQ09NUE9ORU5UUywgbmFtZSwgdHJ1ZSwgbWF5YmVTZWxmUmVmZXJlbmNlKSB8fCBuYW1lO1xufVxuY29uc3QgTlVMTF9EWU5BTUlDX0NPTVBPTkVOVCA9IFN5bWJvbC5mb3IoXCJ2LW5kY1wiKTtcbmZ1bmN0aW9uIHJlc29sdmVEeW5hbWljQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICBpZiAoaXNTdHJpbmcoY29tcG9uZW50KSkge1xuICAgIHJldHVybiByZXNvbHZlQXNzZXQoQ09NUE9ORU5UUywgY29tcG9uZW50LCBmYWxzZSkgfHwgY29tcG9uZW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb21wb25lbnQgfHwgTlVMTF9EWU5BTUlDX0NPTVBPTkVOVDtcbiAgfVxufVxuZnVuY3Rpb24gcmVzb2x2ZURpcmVjdGl2ZShuYW1lKSB7XG4gIHJldHVybiByZXNvbHZlQXNzZXQoRElSRUNUSVZFUywgbmFtZSk7XG59XG5mdW5jdGlvbiByZXNvbHZlQXNzZXQodHlwZSwgbmFtZSwgd2Fybk1pc3NpbmcgPSB0cnVlLCBtYXliZVNlbGZSZWZlcmVuY2UgPSBmYWxzZSkge1xuICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSB8fCBjdXJyZW50SW5zdGFuY2U7XG4gIGlmIChpbnN0YW5jZSkge1xuICAgIGNvbnN0IENvbXBvbmVudCA9IGluc3RhbmNlLnR5cGU7XG4gICAgaWYgKHR5cGUgPT09IENPTVBPTkVOVFMpIHtcbiAgICAgIGNvbnN0IHNlbGZOYW1lID0gZ2V0Q29tcG9uZW50TmFtZShcbiAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICBmYWxzZVxuICAgICAgICAvKiBkbyBub3QgaW5jbHVkZSBpbmZlcnJlZCBuYW1lIHRvIGF2b2lkIGJyZWFraW5nIGV4aXN0aW5nIGNvZGUgKi9cbiAgICAgICk7XG4gICAgICBpZiAoc2VsZk5hbWUgJiYgKHNlbGZOYW1lID09PSBuYW1lIHx8IHNlbGZOYW1lID09PSBjYW1lbGl6ZShuYW1lKSB8fCBzZWxmTmFtZSA9PT0gY2FwaXRhbGl6ZShjYW1lbGl6ZShuYW1lKSkpKSB7XG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IChcbiAgICAgIC8vIGxvY2FsIHJlZ2lzdHJhdGlvblxuICAgICAgLy8gY2hlY2sgaW5zdGFuY2VbdHlwZV0gZmlyc3Qgd2hpY2ggaXMgcmVzb2x2ZWQgZm9yIG9wdGlvbnMgQVBJXG4gICAgICByZXNvbHZlKGluc3RhbmNlW3R5cGVdIHx8IENvbXBvbmVudFt0eXBlXSwgbmFtZSkgfHwgLy8gZ2xvYmFsIHJlZ2lzdHJhdGlvblxuICAgICAgcmVzb2x2ZShpbnN0YW5jZS5hcHBDb250ZXh0W3R5cGVdLCBuYW1lKVxuICAgICk7XG4gICAgaWYgKCFyZXMgJiYgbWF5YmVTZWxmUmVmZXJlbmNlKSB7XG4gICAgICByZXR1cm4gQ29tcG9uZW50O1xuICAgIH1cbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB3YXJuTWlzc2luZyAmJiAhcmVzKSB7XG4gICAgICBjb25zdCBleHRyYSA9IHR5cGUgPT09IENPTVBPTkVOVFMgPyBgXG5JZiB0aGlzIGlzIGEgbmF0aXZlIGN1c3RvbSBlbGVtZW50LCBtYWtlIHN1cmUgdG8gZXhjbHVkZSBpdCBmcm9tIGNvbXBvbmVudCByZXNvbHV0aW9uIHZpYSBjb21waWxlck9wdGlvbnMuaXNDdXN0b21FbGVtZW50LmAgOiBgYDtcbiAgICAgIHdhcm4oYEZhaWxlZCB0byByZXNvbHZlICR7dHlwZS5zbGljZSgwLCAtMSl9OiAke25hbWV9JHtleHRyYX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihcbiAgICAgIGByZXNvbHZlJHtjYXBpdGFsaXplKHR5cGUuc2xpY2UoMCwgLTEpKX0gY2FuIG9ubHkgYmUgdXNlZCBpbiByZW5kZXIoKSBvciBzZXR1cCgpLmBcbiAgICApO1xuICB9XG59XG5mdW5jdGlvbiByZXNvbHZlKHJlZ2lzdHJ5LCBuYW1lKSB7XG4gIHJldHVybiByZWdpc3RyeSAmJiAocmVnaXN0cnlbbmFtZV0gfHwgcmVnaXN0cnlbY2FtZWxpemUobmFtZSldIHx8IHJlZ2lzdHJ5W2NhcGl0YWxpemUoY2FtZWxpemUobmFtZSkpXSk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckxpc3Qoc291cmNlLCByZW5kZXJJdGVtLCBjYWNoZSwgaW5kZXgpIHtcbiAgbGV0IHJldDtcbiAgY29uc3QgY2FjaGVkID0gY2FjaGUgJiYgY2FjaGVbaW5kZXhdO1xuICBpZiAoaXNBcnJheShzb3VyY2UpIHx8IGlzU3RyaW5nKHNvdXJjZSkpIHtcbiAgICByZXQgPSBuZXcgQXJyYXkoc291cmNlLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzb3VyY2UubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICByZXRbaV0gPSByZW5kZXJJdGVtKHNvdXJjZVtpXSwgaSwgdm9pZCAwLCBjYWNoZWQgJiYgY2FjaGVkW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gXCJudW1iZXJcIikge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFOdW1iZXIuaXNJbnRlZ2VyKHNvdXJjZSkpIHtcbiAgICAgIHdhcm4oYFRoZSB2LWZvciByYW5nZSBleHBlY3QgYW4gaW50ZWdlciB2YWx1ZSBidXQgZ290ICR7c291cmNlfS5gKTtcbiAgICB9XG4gICAgcmV0ID0gbmV3IEFycmF5KHNvdXJjZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2U7IGkrKykge1xuICAgICAgcmV0W2ldID0gcmVuZGVySXRlbShpICsgMSwgaSwgdm9pZCAwLCBjYWNoZWQgJiYgY2FjaGVkW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3Qoc291cmNlKSkge1xuICAgIGlmIChzb3VyY2VbU3ltYm9sLml0ZXJhdG9yXSkge1xuICAgICAgcmV0ID0gQXJyYXkuZnJvbShcbiAgICAgICAgc291cmNlLFxuICAgICAgICAoaXRlbSwgaSkgPT4gcmVuZGVySXRlbShpdGVtLCBpLCB2b2lkIDAsIGNhY2hlZCAmJiBjYWNoZWRbaV0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgICAgIHJldCA9IG5ldyBBcnJheShrZXlzLmxlbmd0aCk7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgIHJldFtpXSA9IHJlbmRlckl0ZW0oc291cmNlW2tleV0sIGtleSwgaSwgY2FjaGVkICYmIGNhY2hlZFtpXSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldCA9IFtdO1xuICB9XG4gIGlmIChjYWNoZSkge1xuICAgIGNhY2hlW2luZGV4XSA9IHJldDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTbG90cyhzbG90cywgZHluYW1pY1Nsb3RzKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZHluYW1pY1Nsb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgc2xvdCA9IGR5bmFtaWNTbG90c1tpXTtcbiAgICBpZiAoaXNBcnJheShzbG90KSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbG90Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHNsb3RzW3Nsb3Rbal0ubmFtZV0gPSBzbG90W2pdLmZuO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2xvdCkge1xuICAgICAgc2xvdHNbc2xvdC5uYW1lXSA9IHNsb3Qua2V5ID8gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gc2xvdC5mbiguLi5hcmdzKTtcbiAgICAgICAgaWYgKHJlcylcbiAgICAgICAgICByZXMua2V5ID0gc2xvdC5rZXk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9IDogc2xvdC5mbjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNsb3RzO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTbG90KHNsb3RzLCBuYW1lLCBwcm9wcyA9IHt9LCBmYWxsYmFjaywgbm9TbG90dGVkKSB7XG4gIGlmIChjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UuaXNDRSB8fCBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UucGFyZW50ICYmIGlzQXN5bmNXcmFwcGVyKGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZS5wYXJlbnQpICYmIGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZS5wYXJlbnQuaXNDRSkge1xuICAgIGlmIChuYW1lICE9PSBcImRlZmF1bHRcIilcbiAgICAgIHByb3BzLm5hbWUgPSBuYW1lO1xuICAgIHJldHVybiBjcmVhdGVWTm9kZShcInNsb3RcIiwgcHJvcHMsIGZhbGxiYWNrICYmIGZhbGxiYWNrKCkpO1xuICB9XG4gIGxldCBzbG90ID0gc2xvdHNbbmFtZV07XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHNsb3QgJiYgc2xvdC5sZW5ndGggPiAxKSB7XG4gICAgd2FybihcbiAgICAgIGBTU1Itb3B0aW1pemVkIHNsb3QgZnVuY3Rpb24gZGV0ZWN0ZWQgaW4gYSBub24tU1NSLW9wdGltaXplZCByZW5kZXIgZnVuY3Rpb24uIFlvdSBuZWVkIHRvIG1hcmsgdGhpcyBjb21wb25lbnQgd2l0aCAkZHluYW1pYy1zbG90cyBpbiB0aGUgcGFyZW50IHRlbXBsYXRlLmBcbiAgICApO1xuICAgIHNsb3QgPSAoKSA9PiBbXTtcbiAgfVxuICBpZiAoc2xvdCAmJiBzbG90Ll9jKSB7XG4gICAgc2xvdC5fZCA9IGZhbHNlO1xuICB9XG4gIG9wZW5CbG9jaygpO1xuICBjb25zdCB2YWxpZFNsb3RDb250ZW50ID0gc2xvdCAmJiBlbnN1cmVWYWxpZFZOb2RlKHNsb3QocHJvcHMpKTtcbiAgY29uc3QgcmVuZGVyZWQgPSBjcmVhdGVCbG9jayhcbiAgICBGcmFnbWVudCxcbiAgICB7XG4gICAgICBrZXk6IHByb3BzLmtleSB8fCAvLyBzbG90IGNvbnRlbnQgYXJyYXkgb2YgYSBkeW5hbWljIGNvbmRpdGlvbmFsIHNsb3QgbWF5IGhhdmUgYSBicmFuY2hcbiAgICAgIC8vIGtleSBhdHRhY2hlZCBpbiB0aGUgYGNyZWF0ZVNsb3RzYCBoZWxwZXIsIHJlc3BlY3QgdGhhdFxuICAgICAgdmFsaWRTbG90Q29udGVudCAmJiB2YWxpZFNsb3RDb250ZW50LmtleSB8fCBgXyR7bmFtZX1gXG4gICAgfSxcbiAgICB2YWxpZFNsb3RDb250ZW50IHx8IChmYWxsYmFjayA/IGZhbGxiYWNrKCkgOiBbXSksXG4gICAgdmFsaWRTbG90Q29udGVudCAmJiBzbG90cy5fID09PSAxID8gNjQgOiAtMlxuICApO1xuICBpZiAoIW5vU2xvdHRlZCAmJiByZW5kZXJlZC5zY29wZUlkKSB7XG4gICAgcmVuZGVyZWQuc2xvdFNjb3BlSWRzID0gW3JlbmRlcmVkLnNjb3BlSWQgKyBcIi1zXCJdO1xuICB9XG4gIGlmIChzbG90ICYmIHNsb3QuX2MpIHtcbiAgICBzbG90Ll9kID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVuZGVyZWQ7XG59XG5mdW5jdGlvbiBlbnN1cmVWYWxpZFZOb2RlKHZub2Rlcykge1xuICByZXR1cm4gdm5vZGVzLnNvbWUoKGNoaWxkKSA9PiB7XG4gICAgaWYgKCFpc1ZOb2RlKGNoaWxkKSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGlmIChjaGlsZC50eXBlID09PSBDb21tZW50KVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChjaGlsZC50eXBlID09PSBGcmFnbWVudCAmJiAhZW5zdXJlVmFsaWRWTm9kZShjaGlsZC5jaGlsZHJlbikpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pID8gdm5vZGVzIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gdG9IYW5kbGVycyhvYmosIHByZXNlcnZlQ2FzZUlmTmVjZXNzYXJ5KSB7XG4gIGNvbnN0IHJldCA9IHt9O1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaXNPYmplY3Qob2JqKSkge1xuICAgIHdhcm4oYHYtb24gd2l0aCBubyBhcmd1bWVudCBleHBlY3RzIGFuIG9iamVjdCB2YWx1ZS5gKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIHJldFtwcmVzZXJ2ZUNhc2VJZk5lY2Vzc2FyeSAmJiAvW0EtWl0vLnRlc3Qoa2V5KSA/IGBvbjoke2tleX1gIDogdG9IYW5kbGVyS2V5KGtleSldID0gb2JqW2tleV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuY29uc3QgZ2V0UHVibGljSW5zdGFuY2UgPSAoaSkgPT4ge1xuICBpZiAoIWkpXG4gICAgcmV0dXJuIG51bGw7XG4gIGlmIChpc1N0YXRlZnVsQ29tcG9uZW50KGkpKVxuICAgIHJldHVybiBnZXRFeHBvc2VQcm94eShpKSB8fCBpLnByb3h5O1xuICByZXR1cm4gZ2V0UHVibGljSW5zdGFuY2UoaS5wYXJlbnQpO1xufTtcbmNvbnN0IHB1YmxpY1Byb3BlcnRpZXNNYXAgPSAoXG4gIC8vIE1vdmUgUFVSRSBtYXJrZXIgdG8gbmV3IGxpbmUgdG8gd29ya2Fyb3VuZCBjb21waWxlciBkaXNjYXJkaW5nIGl0XG4gIC8vIGR1ZSB0byB0eXBlIGFubm90YXRpb25cbiAgLyogQF9fUFVSRV9fICovIGV4dGVuZCgvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuICAgICQ6IChpKSA9PiBpLFxuICAgICRlbDogKGkpID0+IGkudm5vZGUuZWwsXG4gICAgJGRhdGE6IChpKSA9PiBpLmRhdGEsXG4gICAgJHByb3BzOiAoaSkgPT4gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHNoYWxsb3dSZWFkb25seShpLnByb3BzKSA6IGkucHJvcHMsXG4gICAgJGF0dHJzOiAoaSkgPT4gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHNoYWxsb3dSZWFkb25seShpLmF0dHJzKSA6IGkuYXR0cnMsXG4gICAgJHNsb3RzOiAoaSkgPT4gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHNoYWxsb3dSZWFkb25seShpLnNsb3RzKSA6IGkuc2xvdHMsXG4gICAgJHJlZnM6IChpKSA9PiAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpID8gc2hhbGxvd1JlYWRvbmx5KGkucmVmcykgOiBpLnJlZnMsXG4gICAgJHBhcmVudDogKGkpID0+IGdldFB1YmxpY0luc3RhbmNlKGkucGFyZW50KSxcbiAgICAkcm9vdDogKGkpID0+IGdldFB1YmxpY0luc3RhbmNlKGkucm9vdCksXG4gICAgJGVtaXQ6IChpKSA9PiBpLmVtaXQsXG4gICAgJG9wdGlvbnM6IChpKSA9PiBfX1ZVRV9PUFRJT05TX0FQSV9fID8gcmVzb2x2ZU1lcmdlZE9wdGlvbnMoaSkgOiBpLnR5cGUsXG4gICAgJGZvcmNlVXBkYXRlOiAoaSkgPT4gaS5mIHx8IChpLmYgPSAoKSA9PiBxdWV1ZUpvYihpLnVwZGF0ZSkpLFxuICAgICRuZXh0VGljazogKGkpID0+IGkubiB8fCAoaS5uID0gbmV4dFRpY2suYmluZChpLnByb3h5KSksXG4gICAgJHdhdGNoOiAoaSkgPT4gX19WVUVfT1BUSU9OU19BUElfXyA/IGluc3RhbmNlV2F0Y2guYmluZChpKSA6IE5PT1BcbiAgfSlcbik7XG5jb25zdCBpc1Jlc2VydmVkUHJlZml4ID0gKGtleSkgPT4ga2V5ID09PSBcIl9cIiB8fCBrZXkgPT09IFwiJFwiO1xuY29uc3QgaGFzU2V0dXBCaW5kaW5nID0gKHN0YXRlLCBrZXkpID0+IHN0YXRlICE9PSBFTVBUWV9PQkogJiYgIXN0YXRlLl9faXNTY3JpcHRTZXR1cCAmJiBoYXNPd24oc3RhdGUsIGtleSk7XG5jb25zdCBQdWJsaWNJbnN0YW5jZVByb3h5SGFuZGxlcnMgPSB7XG4gIGdldCh7IF86IGluc3RhbmNlIH0sIGtleSkge1xuICAgIGNvbnN0IHsgY3R4LCBzZXR1cFN0YXRlLCBkYXRhLCBwcm9wcywgYWNjZXNzQ2FjaGUsIHR5cGUsIGFwcENvbnRleHQgfSA9IGluc3RhbmNlO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGtleSA9PT0gXCJfX2lzVnVlXCIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBsZXQgbm9ybWFsaXplZFByb3BzO1xuICAgIGlmIChrZXlbMF0gIT09IFwiJFwiKSB7XG4gICAgICBjb25zdCBuID0gYWNjZXNzQ2FjaGVba2V5XTtcbiAgICAgIGlmIChuICE9PSB2b2lkIDApIHtcbiAgICAgICAgc3dpdGNoIChuKSB7XG4gICAgICAgICAgY2FzZSAxIC8qIFNFVFVQICovOlxuICAgICAgICAgICAgcmV0dXJuIHNldHVwU3RhdGVba2V5XTtcbiAgICAgICAgICBjYXNlIDIgLyogREFUQSAqLzpcbiAgICAgICAgICAgIHJldHVybiBkYXRhW2tleV07XG4gICAgICAgICAgY2FzZSA0IC8qIENPTlRFWFQgKi86XG4gICAgICAgICAgICByZXR1cm4gY3R4W2tleV07XG4gICAgICAgICAgY2FzZSAzIC8qIFBST1BTICovOlxuICAgICAgICAgICAgcmV0dXJuIHByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaGFzU2V0dXBCaW5kaW5nKHNldHVwU3RhdGUsIGtleSkpIHtcbiAgICAgICAgYWNjZXNzQ2FjaGVba2V5XSA9IDEgLyogU0VUVVAgKi87XG4gICAgICAgIHJldHVybiBzZXR1cFN0YXRlW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGRhdGEgIT09IEVNUFRZX09CSiAmJiBoYXNPd24oZGF0YSwga2V5KSkge1xuICAgICAgICBhY2Nlc3NDYWNoZVtrZXldID0gMiAvKiBEQVRBICovO1xuICAgICAgICByZXR1cm4gZGF0YVtrZXldO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgLy8gb25seSBjYWNoZSBvdGhlciBwcm9wZXJ0aWVzIHdoZW4gaW5zdGFuY2UgaGFzIGRlY2xhcmVkICh0aHVzIHN0YWJsZSlcbiAgICAgICAgLy8gcHJvcHNcbiAgICAgICAgKG5vcm1hbGl6ZWRQcm9wcyA9IGluc3RhbmNlLnByb3BzT3B0aW9uc1swXSkgJiYgaGFzT3duKG5vcm1hbGl6ZWRQcm9wcywga2V5KVxuICAgICAgKSB7XG4gICAgICAgIGFjY2Vzc0NhY2hlW2tleV0gPSAzIC8qIFBST1BTICovO1xuICAgICAgICByZXR1cm4gcHJvcHNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoY3R4ICE9PSBFTVBUWV9PQkogJiYgaGFzT3duKGN0eCwga2V5KSkge1xuICAgICAgICBhY2Nlc3NDYWNoZVtrZXldID0gNCAvKiBDT05URVhUICovO1xuICAgICAgICByZXR1cm4gY3R4W2tleV07XG4gICAgICB9IGVsc2UgaWYgKCFfX1ZVRV9PUFRJT05TX0FQSV9fIHx8IHNob3VsZENhY2hlQWNjZXNzKSB7XG4gICAgICAgIGFjY2Vzc0NhY2hlW2tleV0gPSAwIC8qIE9USEVSICovO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwdWJsaWNHZXR0ZXIgPSBwdWJsaWNQcm9wZXJ0aWVzTWFwW2tleV07XG4gICAgbGV0IGNzc01vZHVsZSwgZ2xvYmFsUHJvcGVydGllcztcbiAgICBpZiAocHVibGljR2V0dGVyKSB7XG4gICAgICBpZiAoa2V5ID09PSBcIiRhdHRyc1wiKSB7XG4gICAgICAgIHRyYWNrKGluc3RhbmNlLCBcImdldFwiLCBrZXkpO1xuICAgICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIG1hcmtBdHRyc0FjY2Vzc2VkKCk7XG4gICAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYga2V5ID09PSBcIiRzbG90c1wiKSB7XG4gICAgICAgIHRyYWNrKGluc3RhbmNlLCBcImdldFwiLCBrZXkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHB1YmxpY0dldHRlcihpbnN0YW5jZSk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIC8vIGNzcyBtb2R1bGUgKGluamVjdGVkIGJ5IHZ1ZS1sb2FkZXIpXG4gICAgICAoY3NzTW9kdWxlID0gdHlwZS5fX2Nzc01vZHVsZXMpICYmIChjc3NNb2R1bGUgPSBjc3NNb2R1bGVba2V5XSlcbiAgICApIHtcbiAgICAgIHJldHVybiBjc3NNb2R1bGU7XG4gICAgfSBlbHNlIGlmIChjdHggIT09IEVNUFRZX09CSiAmJiBoYXNPd24oY3R4LCBrZXkpKSB7XG4gICAgICBhY2Nlc3NDYWNoZVtrZXldID0gNCAvKiBDT05URVhUICovO1xuICAgICAgcmV0dXJuIGN0eFtrZXldO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAvLyBnbG9iYWwgcHJvcGVydGllc1xuICAgICAgZ2xvYmFsUHJvcGVydGllcyA9IGFwcENvbnRleHQuY29uZmlnLmdsb2JhbFByb3BlcnRpZXMsIGhhc093bihnbG9iYWxQcm9wZXJ0aWVzLCBrZXkpXG4gICAgKSB7XG4gICAgICB7XG4gICAgICAgIHJldHVybiBnbG9iYWxQcm9wZXJ0aWVzW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSAmJiAoIWlzU3RyaW5nKGtleSkgfHwgLy8gIzEwOTEgYXZvaWQgaW50ZXJuYWwgaXNSZWYvaXNWTm9kZSBjaGVja3Mgb24gY29tcG9uZW50IGluc3RhbmNlIGxlYWRpbmdcbiAgICAvLyB0byBpbmZpbml0ZSB3YXJuaW5nIGxvb3BcbiAgICBrZXkuaW5kZXhPZihcIl9fdlwiKSAhPT0gMCkpIHtcbiAgICAgIGlmIChkYXRhICE9PSBFTVBUWV9PQkogJiYgaXNSZXNlcnZlZFByZWZpeChrZXlbMF0pICYmIGhhc093bihkYXRhLCBrZXkpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgYFByb3BlcnR5ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICBrZXlcbiAgICAgICAgICApfSBtdXN0IGJlIGFjY2Vzc2VkIHZpYSAkZGF0YSBiZWNhdXNlIGl0IHN0YXJ0cyB3aXRoIGEgcmVzZXJ2ZWQgY2hhcmFjdGVyIChcIiRcIiBvciBcIl9cIikgYW5kIGlzIG5vdCBwcm94aWVkIG9uIHRoZSByZW5kZXIgY29udGV4dC5gXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGluc3RhbmNlID09PSBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgUHJvcGVydHkgJHtKU09OLnN0cmluZ2lmeShrZXkpfSB3YXMgYWNjZXNzZWQgZHVyaW5nIHJlbmRlciBidXQgaXMgbm90IGRlZmluZWQgb24gaW5zdGFuY2UuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgc2V0KHsgXzogaW5zdGFuY2UgfSwga2V5LCB2YWx1ZSkge1xuICAgIGNvbnN0IHsgZGF0YSwgc2V0dXBTdGF0ZSwgY3R4IH0gPSBpbnN0YW5jZTtcbiAgICBpZiAoaGFzU2V0dXBCaW5kaW5nKHNldHVwU3RhdGUsIGtleSkpIHtcbiAgICAgIHNldHVwU3RhdGVba2V5XSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHNldHVwU3RhdGUuX19pc1NjcmlwdFNldHVwICYmIGhhc093bihzZXR1cFN0YXRlLCBrZXkpKSB7XG4gICAgICB3YXJuKGBDYW5ub3QgbXV0YXRlIDxzY3JpcHQgc2V0dXA+IGJpbmRpbmcgXCIke2tleX1cIiBmcm9tIE9wdGlvbnMgQVBJLmApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGF0YSAhPT0gRU1QVFlfT0JKICYmIGhhc093bihkYXRhLCBrZXkpKSB7XG4gICAgICBkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGFzT3duKGluc3RhbmNlLnByb3BzLCBrZXkpKSB7XG4gICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYEF0dGVtcHRpbmcgdG8gbXV0YXRlIHByb3AgXCIke2tleX1cIi4gUHJvcHMgYXJlIHJlYWRvbmx5LmApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoa2V5WzBdID09PSBcIiRcIiAmJiBrZXkuc2xpY2UoMSkgaW4gaW5zdGFuY2UpIHtcbiAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgICAgYEF0dGVtcHRpbmcgdG8gbXV0YXRlIHB1YmxpYyBwcm9wZXJ0eSBcIiR7a2V5fVwiLiBQcm9wZXJ0aWVzIHN0YXJ0aW5nIHdpdGggJCBhcmUgcmVzZXJ2ZWQgYW5kIHJlYWRvbmx5LmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGtleSBpbiBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5nbG9iYWxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHgsIGtleSwge1xuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGhhcyh7XG4gICAgXzogeyBkYXRhLCBzZXR1cFN0YXRlLCBhY2Nlc3NDYWNoZSwgY3R4LCBhcHBDb250ZXh0LCBwcm9wc09wdGlvbnMgfVxuICB9LCBrZXkpIHtcbiAgICBsZXQgbm9ybWFsaXplZFByb3BzO1xuICAgIHJldHVybiAhIWFjY2Vzc0NhY2hlW2tleV0gfHwgZGF0YSAhPT0gRU1QVFlfT0JKICYmIGhhc093bihkYXRhLCBrZXkpIHx8IGhhc1NldHVwQmluZGluZyhzZXR1cFN0YXRlLCBrZXkpIHx8IChub3JtYWxpemVkUHJvcHMgPSBwcm9wc09wdGlvbnNbMF0pICYmIGhhc093bihub3JtYWxpemVkUHJvcHMsIGtleSkgfHwgaGFzT3duKGN0eCwga2V5KSB8fCBoYXNPd24ocHVibGljUHJvcGVydGllc01hcCwga2V5KSB8fCBoYXNPd24oYXBwQ29udGV4dC5jb25maWcuZ2xvYmFsUHJvcGVydGllcywga2V5KTtcbiAgfSxcbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoZGVzY3JpcHRvci5nZXQgIT0gbnVsbCkge1xuICAgICAgdGFyZ2V0Ll8uYWNjZXNzQ2FjaGVba2V5XSA9IDA7XG4gICAgfSBlbHNlIGlmIChoYXNPd24oZGVzY3JpcHRvciwgXCJ2YWx1ZVwiKSkge1xuICAgICAgdGhpcy5zZXQodGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IudmFsdWUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn07XG5pZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB0cnVlKSB7XG4gIFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycy5vd25LZXlzID0gKHRhcmdldCkgPT4ge1xuICAgIHdhcm4oXG4gICAgICBgQXZvaWQgYXBwIGxvZ2ljIHRoYXQgcmVsaWVzIG9uIGVudW1lcmF0aW5nIGtleXMgb24gYSBjb21wb25lbnQgaW5zdGFuY2UuIFRoZSBrZXlzIHdpbGwgYmUgZW1wdHkgaW4gcHJvZHVjdGlvbiBtb2RlIHRvIGF2b2lkIHBlcmZvcm1hbmNlIG92ZXJoZWFkLmBcbiAgICApO1xuICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbiAgfTtcbn1cbmNvbnN0IFJ1bnRpbWVDb21waWxlZFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycyA9IC8qIEBfX1BVUkVfXyAqLyBleHRlbmQoXG4gIHt9LFxuICBQdWJsaWNJbnN0YW5jZVByb3h5SGFuZGxlcnMsXG4gIHtcbiAgICBnZXQodGFyZ2V0LCBrZXkpIHtcbiAgICAgIGlmIChrZXkgPT09IFN5bWJvbC51bnNjb3BhYmxlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gUHVibGljSW5zdGFuY2VQcm94eUhhbmRsZXJzLmdldCh0YXJnZXQsIGtleSwgdGFyZ2V0KTtcbiAgICB9LFxuICAgIGhhcyhfLCBrZXkpIHtcbiAgICAgIGNvbnN0IGhhcyA9IGtleVswXSAhPT0gXCJfXCIgJiYgIWlzR2xvYmFsbHlXaGl0ZWxpc3RlZChrZXkpO1xuICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWhhcyAmJiBQdWJsaWNJbnN0YW5jZVByb3h5SGFuZGxlcnMuaGFzKF8sIGtleSkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgUHJvcGVydHkgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIGtleVxuICAgICAgICAgICl9IHNob3VsZCBub3Qgc3RhcnQgd2l0aCBfIHdoaWNoIGlzIGEgcmVzZXJ2ZWQgcHJlZml4IGZvciBWdWUgaW50ZXJuYWxzLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYXM7XG4gICAgfVxuICB9XG4pO1xuZnVuY3Rpb24gY3JlYXRlRGV2UmVuZGVyQ29udGV4dChpbnN0YW5jZSkge1xuICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYF9gLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGdldDogKCkgPT4gaW5zdGFuY2VcbiAgfSk7XG4gIE9iamVjdC5rZXlzKHB1YmxpY1Byb3BlcnRpZXNNYXApLmZvckVhY2goKGtleSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6ICgpID0+IHB1YmxpY1Byb3BlcnRpZXNNYXBba2V5XShpbnN0YW5jZSksXG4gICAgICAvLyBpbnRlcmNlcHRlZCBieSB0aGUgcHJveHkgc28gbm8gbmVlZCBmb3IgaW1wbGVtZW50YXRpb24sXG4gICAgICAvLyBidXQgbmVlZGVkIHRvIHByZXZlbnQgc2V0IGVycm9yc1xuICAgICAgc2V0OiBOT09QXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gZXhwb3NlUHJvcHNPblJlbmRlckNvbnRleHQoaW5zdGFuY2UpIHtcbiAgY29uc3Qge1xuICAgIGN0eCxcbiAgICBwcm9wc09wdGlvbnM6IFtwcm9wc09wdGlvbnNdXG4gIH0gPSBpbnN0YW5jZTtcbiAgaWYgKHByb3BzT3B0aW9ucykge1xuICAgIE9iamVjdC5rZXlzKHByb3BzT3B0aW9ucykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3R4LCBrZXksIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICgpID0+IGluc3RhbmNlLnByb3BzW2tleV0sXG4gICAgICAgIHNldDogTk9PUFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGV4cG9zZVNldHVwU3RhdGVPblJlbmRlckNvbnRleHQoaW5zdGFuY2UpIHtcbiAgY29uc3QgeyBjdHgsIHNldHVwU3RhdGUgfSA9IGluc3RhbmNlO1xuICBPYmplY3Qua2V5cyh0b1JhdyhzZXR1cFN0YXRlKSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKCFzZXR1cFN0YXRlLl9faXNTY3JpcHRTZXR1cCkge1xuICAgICAgaWYgKGlzUmVzZXJ2ZWRQcmVmaXgoa2V5WzBdKSkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIGBzZXR1cCgpIHJldHVybiBwcm9wZXJ0eSAke0pTT04uc3RyaW5naWZ5KFxuICAgICAgICAgICAga2V5XG4gICAgICAgICAgKX0gc2hvdWxkIG5vdCBzdGFydCB3aXRoIFwiJFwiIG9yIFwiX1wiIHdoaWNoIGFyZSByZXNlcnZlZCBwcmVmaXhlcyBmb3IgVnVlIGludGVybmFscy5gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHgsIGtleSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4gc2V0dXBTdGF0ZVtrZXldLFxuICAgICAgICBzZXQ6IE5PT1BcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmNvbnN0IHdhcm5SdW50aW1lVXNhZ2UgPSAobWV0aG9kKSA9PiB3YXJuKFxuICBgJHttZXRob2R9KCkgaXMgYSBjb21waWxlci1oaW50IGhlbHBlciB0aGF0IGlzIG9ubHkgdXNhYmxlIGluc2lkZSA8c2NyaXB0IHNldHVwPiBvZiBhIHNpbmdsZSBmaWxlIGNvbXBvbmVudC4gSXRzIGFyZ3VtZW50cyBzaG91bGQgYmUgY29tcGlsZWQgYXdheSBhbmQgcGFzc2luZyBpdCBhdCBydW50aW1lIGhhcyBubyBlZmZlY3QuYFxuKTtcbmZ1bmN0aW9uIGRlZmluZVByb3BzKCkge1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIHdhcm5SdW50aW1lVXNhZ2UoYGRlZmluZVByb3BzYCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBkZWZpbmVFbWl0cygpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICB3YXJuUnVudGltZVVzYWdlKGBkZWZpbmVFbWl0c2ApO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZGVmaW5lRXhwb3NlKGV4cG9zZWQpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICB3YXJuUnVudGltZVVzYWdlKGBkZWZpbmVFeHBvc2VgKTtcbiAgfVxufVxuZnVuY3Rpb24gZGVmaW5lT3B0aW9ucyhvcHRpb25zKSB7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FyblJ1bnRpbWVVc2FnZShgZGVmaW5lT3B0aW9uc2ApO1xuICB9XG59XG5mdW5jdGlvbiBkZWZpbmVTbG90cygpIHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICB3YXJuUnVudGltZVVzYWdlKGBkZWZpbmVTbG90c2ApO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZGVmaW5lTW9kZWwoKSB7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FyblJ1bnRpbWVVc2FnZShcImRlZmluZU1vZGVsXCIpO1xuICB9XG59XG5mdW5jdGlvbiB3aXRoRGVmYXVsdHMocHJvcHMsIGRlZmF1bHRzKSB7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FyblJ1bnRpbWVVc2FnZShgd2l0aERlZmF1bHRzYCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiB1c2VTbG90cygpIHtcbiAgcmV0dXJuIGdldENvbnRleHQoKS5zbG90cztcbn1cbmZ1bmN0aW9uIHVzZUF0dHJzKCkge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLmF0dHJzO1xufVxuZnVuY3Rpb24gdXNlTW9kZWwocHJvcHMsIG5hbWUsIG9wdGlvbnMpIHtcbiAgY29uc3QgaSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaSkge1xuICAgIHdhcm4oYHVzZU1vZGVsKCkgY2FsbGVkIHdpdGhvdXQgYWN0aXZlIGluc3RhbmNlLmApO1xuICAgIHJldHVybiByZWYoKTtcbiAgfVxuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaS5wcm9wc09wdGlvbnNbMF1bbmFtZV0pIHtcbiAgICB3YXJuKGB1c2VNb2RlbCgpIGNhbGxlZCB3aXRoIHByb3AgXCIke25hbWV9XCIgd2hpY2ggaXMgbm90IGRlY2xhcmVkLmApO1xuICAgIHJldHVybiByZWYoKTtcbiAgfVxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxvY2FsKSB7XG4gICAgY29uc3QgcHJveHkgPSByZWYocHJvcHNbbmFtZV0pO1xuICAgIHdhdGNoKFxuICAgICAgKCkgPT4gcHJvcHNbbmFtZV0sXG4gICAgICAodikgPT4gcHJveHkudmFsdWUgPSB2XG4gICAgKTtcbiAgICB3YXRjaChwcm94eSwgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgIT09IHByb3BzW25hbWVdKSB7XG4gICAgICAgIGkuZW1pdChgdXBkYXRlOiR7bmFtZX1gLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBfX3ZfaXNSZWY6IHRydWUsXG4gICAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiBwcm9wc1tuYW1lXTtcbiAgICAgIH0sXG4gICAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgaS5lbWl0KGB1cGRhdGU6JHtuYW1lfWAsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiBnZXRDb250ZXh0KCkge1xuICBjb25zdCBpID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFpKSB7XG4gICAgd2FybihgdXNlQ29udGV4dCgpIGNhbGxlZCB3aXRob3V0IGFjdGl2ZSBpbnN0YW5jZS5gKTtcbiAgfVxuICByZXR1cm4gaS5zZXR1cENvbnRleHQgfHwgKGkuc2V0dXBDb250ZXh0ID0gY3JlYXRlU2V0dXBDb250ZXh0KGkpKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVByb3BzT3JFbWl0cyhwcm9wcykge1xuICByZXR1cm4gaXNBcnJheShwcm9wcykgPyBwcm9wcy5yZWR1Y2UoXG4gICAgKG5vcm1hbGl6ZWQsIHApID0+IChub3JtYWxpemVkW3BdID0gbnVsbCwgbm9ybWFsaXplZCksXG4gICAge31cbiAgKSA6IHByb3BzO1xufVxuZnVuY3Rpb24gbWVyZ2VEZWZhdWx0cyhyYXcsIGRlZmF1bHRzKSB7XG4gIGNvbnN0IHByb3BzID0gbm9ybWFsaXplUHJvcHNPckVtaXRzKHJhdyk7XG4gIGZvciAoY29uc3Qga2V5IGluIGRlZmF1bHRzKSB7XG4gICAgaWYgKGtleS5zdGFydHNXaXRoKFwiX19za2lwXCIpKVxuICAgICAgY29udGludWU7XG4gICAgbGV0IG9wdCA9IHByb3BzW2tleV07XG4gICAgaWYgKG9wdCkge1xuICAgICAgaWYgKGlzQXJyYXkob3B0KSB8fCBpc0Z1bmN0aW9uKG9wdCkpIHtcbiAgICAgICAgb3B0ID0gcHJvcHNba2V5XSA9IHsgdHlwZTogb3B0LCBkZWZhdWx0OiBkZWZhdWx0c1trZXldIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHQuZGVmYXVsdCA9IGRlZmF1bHRzW2tleV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHQgPT09IG51bGwpIHtcbiAgICAgIG9wdCA9IHByb3BzW2tleV0gPSB7IGRlZmF1bHQ6IGRlZmF1bHRzW2tleV0gfTtcbiAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIHdhcm4oYHByb3BzIGRlZmF1bHQga2V5IFwiJHtrZXl9XCIgaGFzIG5vIGNvcnJlc3BvbmRpbmcgZGVjbGFyYXRpb24uYCk7XG4gICAgfVxuICAgIGlmIChvcHQgJiYgZGVmYXVsdHNbYF9fc2tpcF8ke2tleX1gXSkge1xuICAgICAgb3B0LnNraXBGYWN0b3J5ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuZnVuY3Rpb24gbWVyZ2VNb2RlbHMoYSwgYikge1xuICBpZiAoIWEgfHwgIWIpXG4gICAgcmV0dXJuIGEgfHwgYjtcbiAgaWYgKGlzQXJyYXkoYSkgJiYgaXNBcnJheShiKSlcbiAgICByZXR1cm4gYS5jb25jYXQoYik7XG4gIHJldHVybiBleHRlbmQoe30sIG5vcm1hbGl6ZVByb3BzT3JFbWl0cyhhKSwgbm9ybWFsaXplUHJvcHNPckVtaXRzKGIpKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVByb3BzUmVzdFByb3h5KHByb3BzLCBleGNsdWRlZEtleXMpIHtcbiAgY29uc3QgcmV0ID0ge307XG4gIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgaWYgKCFleGNsdWRlZEtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldCwga2V5LCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4gcHJvcHNba2V5XVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiB3aXRoQXN5bmNDb250ZXh0KGdldEF3YWl0YWJsZSkge1xuICBjb25zdCBjdHggPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWN0eCkge1xuICAgIHdhcm4oXG4gICAgICBgd2l0aEFzeW5jQ29udGV4dCBjYWxsZWQgd2l0aG91dCBhY3RpdmUgY3VycmVudCBpbnN0YW5jZS4gVGhpcyBpcyBsaWtlbHkgYSBidWcuYFxuICAgICk7XG4gIH1cbiAgbGV0IGF3YWl0YWJsZSA9IGdldEF3YWl0YWJsZSgpO1xuICB1bnNldEN1cnJlbnRJbnN0YW5jZSgpO1xuICBpZiAoaXNQcm9taXNlKGF3YWl0YWJsZSkpIHtcbiAgICBhd2FpdGFibGUgPSBhd2FpdGFibGUuY2F0Y2goKGUpID0+IHtcbiAgICAgIHNldEN1cnJlbnRJbnN0YW5jZShjdHgpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gW2F3YWl0YWJsZSwgKCkgPT4gc2V0Q3VycmVudEluc3RhbmNlKGN0eCldO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEdXBsaWNhdGVDaGVja2VyKCkge1xuICBjb25zdCBjYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gKHR5cGUsIGtleSkgPT4ge1xuICAgIGlmIChjYWNoZVtrZXldKSB7XG4gICAgICB3YXJuKGAke3R5cGV9IHByb3BlcnR5IFwiJHtrZXl9XCIgaXMgYWxyZWFkeSBkZWZpbmVkIGluICR7Y2FjaGVba2V5XX0uYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhY2hlW2tleV0gPSB0eXBlO1xuICAgIH1cbiAgfTtcbn1cbmxldCBzaG91bGRDYWNoZUFjY2VzcyA9IHRydWU7XG5mdW5jdGlvbiBhcHBseU9wdGlvbnMoaW5zdGFuY2UpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHJlc29sdmVNZXJnZWRPcHRpb25zKGluc3RhbmNlKTtcbiAgY29uc3QgcHVibGljVGhpcyA9IGluc3RhbmNlLnByb3h5O1xuICBjb25zdCBjdHggPSBpbnN0YW5jZS5jdHg7XG4gIHNob3VsZENhY2hlQWNjZXNzID0gZmFsc2U7XG4gIGlmIChvcHRpb25zLmJlZm9yZUNyZWF0ZSkge1xuICAgIGNhbGxIb29rKG9wdGlvbnMuYmVmb3JlQ3JlYXRlLCBpbnN0YW5jZSwgXCJiY1wiKTtcbiAgfVxuICBjb25zdCB7XG4gICAgLy8gc3RhdGVcbiAgICBkYXRhOiBkYXRhT3B0aW9ucyxcbiAgICBjb21wdXRlZDogY29tcHV0ZWRPcHRpb25zLFxuICAgIG1ldGhvZHMsXG4gICAgd2F0Y2g6IHdhdGNoT3B0aW9ucyxcbiAgICBwcm92aWRlOiBwcm92aWRlT3B0aW9ucyxcbiAgICBpbmplY3Q6IGluamVjdE9wdGlvbnMsXG4gICAgLy8gbGlmZWN5Y2xlXG4gICAgY3JlYXRlZCxcbiAgICBiZWZvcmVNb3VudCxcbiAgICBtb3VudGVkLFxuICAgIGJlZm9yZVVwZGF0ZSxcbiAgICB1cGRhdGVkLFxuICAgIGFjdGl2YXRlZCxcbiAgICBkZWFjdGl2YXRlZCxcbiAgICBiZWZvcmVEZXN0cm95LFxuICAgIGJlZm9yZVVubW91bnQsXG4gICAgZGVzdHJveWVkLFxuICAgIHVubW91bnRlZCxcbiAgICByZW5kZXIsXG4gICAgcmVuZGVyVHJhY2tlZCxcbiAgICByZW5kZXJUcmlnZ2VyZWQsXG4gICAgZXJyb3JDYXB0dXJlZCxcbiAgICBzZXJ2ZXJQcmVmZXRjaCxcbiAgICAvLyBwdWJsaWMgQVBJXG4gICAgZXhwb3NlLFxuICAgIGluaGVyaXRBdHRycyxcbiAgICAvLyBhc3NldHNcbiAgICBjb21wb25lbnRzLFxuICAgIGRpcmVjdGl2ZXMsXG4gICAgZmlsdGVyc1xuICB9ID0gb3B0aW9ucztcbiAgY29uc3QgY2hlY2tEdXBsaWNhdGVQcm9wZXJ0aWVzID0gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IGNyZWF0ZUR1cGxpY2F0ZUNoZWNrZXIoKSA6IG51bGw7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgY29uc3QgW3Byb3BzT3B0aW9uc10gPSBpbnN0YW5jZS5wcm9wc09wdGlvbnM7XG4gICAgaWYgKHByb3BzT3B0aW9ucykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHNPcHRpb25zKSB7XG4gICAgICAgIGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyhcIlByb3BzXCIgLyogUFJPUFMgKi8sIGtleSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChpbmplY3RPcHRpb25zKSB7XG4gICAgcmVzb2x2ZUluamVjdGlvbnMoaW5qZWN0T3B0aW9ucywgY3R4LCBjaGVja0R1cGxpY2F0ZVByb3BlcnRpZXMpO1xuICB9XG4gIGlmIChtZXRob2RzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbWV0aG9kcykge1xuICAgICAgY29uc3QgbWV0aG9kSGFuZGxlciA9IG1ldGhvZHNba2V5XTtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKG1ldGhvZEhhbmRsZXIpKSB7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eCwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogbWV0aG9kSGFuZGxlci5iaW5kKHB1YmxpY1RoaXMpLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4W2tleV0gPSBtZXRob2RIYW5kbGVyLmJpbmQocHVibGljVGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICBjaGVja0R1cGxpY2F0ZVByb3BlcnRpZXMoXCJNZXRob2RzXCIgLyogTUVUSE9EUyAqLywga2V5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgYE1ldGhvZCBcIiR7a2V5fVwiIGhhcyB0eXBlIFwiJHt0eXBlb2YgbWV0aG9kSGFuZGxlcn1cIiBpbiB0aGUgY29tcG9uZW50IGRlZmluaXRpb24uIERpZCB5b3UgcmVmZXJlbmNlIHRoZSBmdW5jdGlvbiBjb3JyZWN0bHk/YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZGF0YU9wdGlvbnMpIHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaXNGdW5jdGlvbihkYXRhT3B0aW9ucykpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBUaGUgZGF0YSBvcHRpb24gbXVzdCBiZSBhIGZ1bmN0aW9uLiBQbGFpbiBvYmplY3QgdXNhZ2UgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC5gXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gZGF0YU9wdGlvbnMuY2FsbChwdWJsaWNUaGlzLCBwdWJsaWNUaGlzKTtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBpc1Byb21pc2UoZGF0YSkpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBkYXRhKCkgcmV0dXJuZWQgYSBQcm9taXNlIC0gbm90ZSBkYXRhKCkgY2Fubm90IGJlIGFzeW5jOyBJZiB5b3UgaW50ZW5kIHRvIHBlcmZvcm0gZGF0YSBmZXRjaGluZyBiZWZvcmUgY29tcG9uZW50IHJlbmRlcnMsIHVzZSBhc3luYyBzZXR1cCgpICsgPFN1c3BlbnNlPi5gXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoIWlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYGRhdGEoKSBzaG91bGQgcmV0dXJuIGFuIG9iamVjdC5gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UuZGF0YSA9IHJlYWN0aXZlKGRhdGEpO1xuICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyhcIkRhdGFcIiAvKiBEQVRBICovLCBrZXkpO1xuICAgICAgICAgIGlmICghaXNSZXNlcnZlZFByZWZpeChrZXlbMF0pKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3R4LCBrZXksIHtcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBnZXQ6ICgpID0+IGRhdGFba2V5XSxcbiAgICAgICAgICAgICAgc2V0OiBOT09QXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgc2hvdWxkQ2FjaGVBY2Nlc3MgPSB0cnVlO1xuICBpZiAoY29tcHV0ZWRPcHRpb25zKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gY29tcHV0ZWRPcHRpb25zKSB7XG4gICAgICBjb25zdCBvcHQgPSBjb21wdXRlZE9wdGlvbnNba2V5XTtcbiAgICAgIGNvbnN0IGdldCA9IGlzRnVuY3Rpb24ob3B0KSA/IG9wdC5iaW5kKHB1YmxpY1RoaXMsIHB1YmxpY1RoaXMpIDogaXNGdW5jdGlvbihvcHQuZ2V0KSA/IG9wdC5nZXQuYmluZChwdWJsaWNUaGlzLCBwdWJsaWNUaGlzKSA6IE5PT1A7XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBnZXQgPT09IE5PT1ApIHtcbiAgICAgICAgd2FybihgQ29tcHV0ZWQgcHJvcGVydHkgXCIke2tleX1cIiBoYXMgbm8gZ2V0dGVyLmApO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2V0ID0gIWlzRnVuY3Rpb24ob3B0KSAmJiBpc0Z1bmN0aW9uKG9wdC5zZXQpID8gb3B0LnNldC5iaW5kKHB1YmxpY1RoaXMpIDogISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/ICgpID0+IHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgV3JpdGUgb3BlcmF0aW9uIGZhaWxlZDogY29tcHV0ZWQgcHJvcGVydHkgXCIke2tleX1cIiBpcyByZWFkb25seS5gXG4gICAgICAgICk7XG4gICAgICB9IDogTk9PUDtcbiAgICAgIGNvbnN0IGMgPSBjb21wdXRlZCh7XG4gICAgICAgIGdldCxcbiAgICAgICAgc2V0XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjdHgsIGtleSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4gYy52YWx1ZSxcbiAgICAgICAgc2V0OiAodikgPT4gYy52YWx1ZSA9IHZcbiAgICAgIH0pO1xuICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgY2hlY2tEdXBsaWNhdGVQcm9wZXJ0aWVzKFwiQ29tcHV0ZWRcIiAvKiBDT01QVVRFRCAqLywga2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHdhdGNoT3B0aW9ucykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHdhdGNoT3B0aW9ucykge1xuICAgICAgY3JlYXRlV2F0Y2hlcih3YXRjaE9wdGlvbnNba2V5XSwgY3R4LCBwdWJsaWNUaGlzLCBrZXkpO1xuICAgIH1cbiAgfVxuICBpZiAocHJvdmlkZU9wdGlvbnMpIHtcbiAgICBjb25zdCBwcm92aWRlcyA9IGlzRnVuY3Rpb24ocHJvdmlkZU9wdGlvbnMpID8gcHJvdmlkZU9wdGlvbnMuY2FsbChwdWJsaWNUaGlzKSA6IHByb3ZpZGVPcHRpb25zO1xuICAgIFJlZmxlY3Qub3duS2V5cyhwcm92aWRlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBwcm92aWRlKGtleSwgcHJvdmlkZXNba2V5XSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGNyZWF0ZWQpIHtcbiAgICBjYWxsSG9vayhjcmVhdGVkLCBpbnN0YW5jZSwgXCJjXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTGlmZWN5Y2xlSG9vayhyZWdpc3RlciwgaG9vaykge1xuICAgIGlmIChpc0FycmF5KGhvb2spKSB7XG4gICAgICBob29rLmZvckVhY2goKF9ob29rKSA9PiByZWdpc3RlcihfaG9vay5iaW5kKHB1YmxpY1RoaXMpKSk7XG4gICAgfSBlbHNlIGlmIChob29rKSB7XG4gICAgICByZWdpc3Rlcihob29rLmJpbmQocHVibGljVGhpcykpO1xuICAgIH1cbiAgfVxuICByZWdpc3RlckxpZmVjeWNsZUhvb2sob25CZWZvcmVNb3VudCwgYmVmb3JlTW91bnQpO1xuICByZWdpc3RlckxpZmVjeWNsZUhvb2sob25Nb3VudGVkLCBtb3VudGVkKTtcbiAgcmVnaXN0ZXJMaWZlY3ljbGVIb29rKG9uQmVmb3JlVXBkYXRlLCBiZWZvcmVVcGRhdGUpO1xuICByZWdpc3RlckxpZmVjeWNsZUhvb2sob25VcGRhdGVkLCB1cGRhdGVkKTtcbiAgcmVnaXN0ZXJMaWZlY3ljbGVIb29rKG9uQWN0aXZhdGVkLCBhY3RpdmF0ZWQpO1xuICByZWdpc3RlckxpZmVjeWNsZUhvb2sob25EZWFjdGl2YXRlZCwgZGVhY3RpdmF0ZWQpO1xuICByZWdpc3RlckxpZmVjeWNsZUhvb2sob25FcnJvckNhcHR1cmVkLCBlcnJvckNhcHR1cmVkKTtcbiAgcmVnaXN0ZXJMaWZlY3ljbGVIb29rKG9uUmVuZGVyVHJhY2tlZCwgcmVuZGVyVHJhY2tlZCk7XG4gIHJlZ2lzdGVyTGlmZWN5Y2xlSG9vayhvblJlbmRlclRyaWdnZXJlZCwgcmVuZGVyVHJpZ2dlcmVkKTtcbiAgcmVnaXN0ZXJMaWZlY3ljbGVIb29rKG9uQmVmb3JlVW5tb3VudCwgYmVmb3JlVW5tb3VudCk7XG4gIHJlZ2lzdGVyTGlmZWN5Y2xlSG9vayhvblVubW91bnRlZCwgdW5tb3VudGVkKTtcbiAgcmVnaXN0ZXJMaWZlY3ljbGVIb29rKG9uU2VydmVyUHJlZmV0Y2gsIHNlcnZlclByZWZldGNoKTtcbiAgaWYgKGlzQXJyYXkoZXhwb3NlKSkge1xuICAgIGlmIChleHBvc2UubGVuZ3RoKSB7XG4gICAgICBjb25zdCBleHBvc2VkID0gaW5zdGFuY2UuZXhwb3NlZCB8fCAoaW5zdGFuY2UuZXhwb3NlZCA9IHt9KTtcbiAgICAgIGV4cG9zZS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9zZWQsIGtleSwge1xuICAgICAgICAgIGdldDogKCkgPT4gcHVibGljVGhpc1trZXldLFxuICAgICAgICAgIHNldDogKHZhbCkgPT4gcHVibGljVGhpc1trZXldID0gdmFsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghaW5zdGFuY2UuZXhwb3NlZCkge1xuICAgICAgaW5zdGFuY2UuZXhwb3NlZCA9IHt9O1xuICAgIH1cbiAgfVxuICBpZiAocmVuZGVyICYmIGluc3RhbmNlLnJlbmRlciA9PT0gTk9PUCkge1xuICAgIGluc3RhbmNlLnJlbmRlciA9IHJlbmRlcjtcbiAgfVxuICBpZiAoaW5oZXJpdEF0dHJzICE9IG51bGwpIHtcbiAgICBpbnN0YW5jZS5pbmhlcml0QXR0cnMgPSBpbmhlcml0QXR0cnM7XG4gIH1cbiAgaWYgKGNvbXBvbmVudHMpXG4gICAgaW5zdGFuY2UuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG4gIGlmIChkaXJlY3RpdmVzKVxuICAgIGluc3RhbmNlLmRpcmVjdGl2ZXMgPSBkaXJlY3RpdmVzO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUluamVjdGlvbnMoaW5qZWN0T3B0aW9ucywgY3R4LCBjaGVja0R1cGxpY2F0ZVByb3BlcnRpZXMgPSBOT09QKSB7XG4gIGlmIChpc0FycmF5KGluamVjdE9wdGlvbnMpKSB7XG4gICAgaW5qZWN0T3B0aW9ucyA9IG5vcm1hbGl6ZUluamVjdChpbmplY3RPcHRpb25zKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBpbmplY3RPcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0ID0gaW5qZWN0T3B0aW9uc1trZXldO1xuICAgIGxldCBpbmplY3RlZDtcbiAgICBpZiAoaXNPYmplY3Qob3B0KSkge1xuICAgICAgaWYgKFwiZGVmYXVsdFwiIGluIG9wdCkge1xuICAgICAgICBpbmplY3RlZCA9IGluamVjdChcbiAgICAgICAgICBvcHQuZnJvbSB8fCBrZXksXG4gICAgICAgICAgb3B0LmRlZmF1bHQsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICAgIC8qIHRyZWF0IGRlZmF1bHQgZnVuY3Rpb24gYXMgZmFjdG9yeSAqL1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5qZWN0ZWQgPSBpbmplY3Qob3B0LmZyb20gfHwga2V5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5qZWN0ZWQgPSBpbmplY3Qob3B0KTtcbiAgICB9XG4gICAgaWYgKGlzUmVmKGluamVjdGVkKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0eCwga2V5LCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiAoKSA9PiBpbmplY3RlZC52YWx1ZSxcbiAgICAgICAgc2V0OiAodikgPT4gaW5qZWN0ZWQudmFsdWUgPSB2XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4W2tleV0gPSBpbmplY3RlZDtcbiAgICB9XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIGNoZWNrRHVwbGljYXRlUHJvcGVydGllcyhcIkluamVjdFwiIC8qIElOSkVDVCAqLywga2V5KTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGNhbGxIb29rKGhvb2ssIGluc3RhbmNlLCB0eXBlKSB7XG4gIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKFxuICAgIGlzQXJyYXkoaG9vaykgPyBob29rLm1hcCgoaCkgPT4gaC5iaW5kKGluc3RhbmNlLnByb3h5KSkgOiBob29rLmJpbmQoaW5zdGFuY2UucHJveHkpLFxuICAgIGluc3RhbmNlLFxuICAgIHR5cGVcbiAgKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVdhdGNoZXIocmF3LCBjdHgsIHB1YmxpY1RoaXMsIGtleSkge1xuICBjb25zdCBnZXR0ZXIgPSBrZXkuaW5jbHVkZXMoXCIuXCIpID8gY3JlYXRlUGF0aEdldHRlcihwdWJsaWNUaGlzLCBrZXkpIDogKCkgPT4gcHVibGljVGhpc1trZXldO1xuICBpZiAoaXNTdHJpbmcocmF3KSkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBjdHhbcmF3XTtcbiAgICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgICAgd2F0Y2goZ2V0dGVyLCBoYW5kbGVyKTtcbiAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIHdhcm4oYEludmFsaWQgd2F0Y2ggaGFuZGxlciBzcGVjaWZpZWQgYnkga2V5IFwiJHtyYXd9XCJgLCBoYW5kbGVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihyYXcpKSB7XG4gICAgd2F0Y2goZ2V0dGVyLCByYXcuYmluZChwdWJsaWNUaGlzKSk7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QocmF3KSkge1xuICAgIGlmIChpc0FycmF5KHJhdykpIHtcbiAgICAgIHJhdy5mb3JFYWNoKChyKSA9PiBjcmVhdGVXYXRjaGVyKHIsIGN0eCwgcHVibGljVGhpcywga2V5KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBpc0Z1bmN0aW9uKHJhdy5oYW5kbGVyKSA/IHJhdy5oYW5kbGVyLmJpbmQocHVibGljVGhpcykgOiBjdHhbcmF3LmhhbmRsZXJdO1xuICAgICAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICAgICAgd2F0Y2goZ2V0dGVyLCBoYW5kbGVyLCByYXcpO1xuICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIHdhcm4oYEludmFsaWQgd2F0Y2ggaGFuZGxlciBzcGVjaWZpZWQgYnkga2V5IFwiJHtyYXcuaGFuZGxlcn1cImAsIGhhbmRsZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihgSW52YWxpZCB3YXRjaCBvcHRpb246IFwiJHtrZXl9XCJgLCByYXcpO1xuICB9XG59XG5mdW5jdGlvbiByZXNvbHZlTWVyZ2VkT3B0aW9ucyhpbnN0YW5jZSkge1xuICBjb25zdCBiYXNlID0gaW5zdGFuY2UudHlwZTtcbiAgY29uc3QgeyBtaXhpbnMsIGV4dGVuZHM6IGV4dGVuZHNPcHRpb25zIH0gPSBiYXNlO1xuICBjb25zdCB7XG4gICAgbWl4aW5zOiBnbG9iYWxNaXhpbnMsXG4gICAgb3B0aW9uc0NhY2hlOiBjYWNoZSxcbiAgICBjb25maWc6IHsgb3B0aW9uTWVyZ2VTdHJhdGVnaWVzIH1cbiAgfSA9IGluc3RhbmNlLmFwcENvbnRleHQ7XG4gIGNvbnN0IGNhY2hlZCA9IGNhY2hlLmdldChiYXNlKTtcbiAgbGV0IHJlc29sdmVkO1xuICBpZiAoY2FjaGVkKSB7XG4gICAgcmVzb2x2ZWQgPSBjYWNoZWQ7XG4gIH0gZWxzZSBpZiAoIWdsb2JhbE1peGlucy5sZW5ndGggJiYgIW1peGlucyAmJiAhZXh0ZW5kc09wdGlvbnMpIHtcbiAgICB7XG4gICAgICByZXNvbHZlZCA9IGJhc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc29sdmVkID0ge307XG4gICAgaWYgKGdsb2JhbE1peGlucy5sZW5ndGgpIHtcbiAgICAgIGdsb2JhbE1peGlucy5mb3JFYWNoKFxuICAgICAgICAobSkgPT4gbWVyZ2VPcHRpb25zKHJlc29sdmVkLCBtLCBvcHRpb25NZXJnZVN0cmF0ZWdpZXMsIHRydWUpXG4gICAgICApO1xuICAgIH1cbiAgICBtZXJnZU9wdGlvbnMocmVzb2x2ZWQsIGJhc2UsIG9wdGlvbk1lcmdlU3RyYXRlZ2llcyk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KGJhc2UpKSB7XG4gICAgY2FjaGUuc2V0KGJhc2UsIHJlc29sdmVkKTtcbiAgfVxuICByZXR1cm4gcmVzb2x2ZWQ7XG59XG5mdW5jdGlvbiBtZXJnZU9wdGlvbnModG8sIGZyb20sIHN0cmF0cywgYXNNaXhpbiA9IGZhbHNlKSB7XG4gIGNvbnN0IHsgbWl4aW5zLCBleHRlbmRzOiBleHRlbmRzT3B0aW9ucyB9ID0gZnJvbTtcbiAgaWYgKGV4dGVuZHNPcHRpb25zKSB7XG4gICAgbWVyZ2VPcHRpb25zKHRvLCBleHRlbmRzT3B0aW9ucywgc3RyYXRzLCB0cnVlKTtcbiAgfVxuICBpZiAobWl4aW5zKSB7XG4gICAgbWl4aW5zLmZvckVhY2goXG4gICAgICAobSkgPT4gbWVyZ2VPcHRpb25zKHRvLCBtLCBzdHJhdHMsIHRydWUpXG4gICAgKTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBmcm9tKSB7XG4gICAgaWYgKGFzTWl4aW4gJiYga2V5ID09PSBcImV4cG9zZVwiKSB7XG4gICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oXG4gICAgICAgIGBcImV4cG9zZVwiIG9wdGlvbiBpcyBpZ25vcmVkIHdoZW4gZGVjbGFyZWQgaW4gbWl4aW5zIG9yIGV4dGVuZHMuIEl0IHNob3VsZCBvbmx5IGJlIGRlY2xhcmVkIGluIHRoZSBiYXNlIGNvbXBvbmVudCBpdHNlbGYuYFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3RyYXQgPSBpbnRlcm5hbE9wdGlvbk1lcmdlU3RyYXRzW2tleV0gfHwgc3RyYXRzICYmIHN0cmF0c1trZXldO1xuICAgICAgdG9ba2V5XSA9IHN0cmF0ID8gc3RyYXQodG9ba2V5XSwgZnJvbVtrZXldKSA6IGZyb21ba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufVxuY29uc3QgaW50ZXJuYWxPcHRpb25NZXJnZVN0cmF0cyA9IHtcbiAgZGF0YTogbWVyZ2VEYXRhRm4sXG4gIHByb3BzOiBtZXJnZUVtaXRzT3JQcm9wc09wdGlvbnMsXG4gIGVtaXRzOiBtZXJnZUVtaXRzT3JQcm9wc09wdGlvbnMsXG4gIC8vIG9iamVjdHNcbiAgbWV0aG9kczogbWVyZ2VPYmplY3RPcHRpb25zLFxuICBjb21wdXRlZDogbWVyZ2VPYmplY3RPcHRpb25zLFxuICAvLyBsaWZlY3ljbGVcbiAgYmVmb3JlQ3JlYXRlOiBtZXJnZUFzQXJyYXksXG4gIGNyZWF0ZWQ6IG1lcmdlQXNBcnJheSxcbiAgYmVmb3JlTW91bnQ6IG1lcmdlQXNBcnJheSxcbiAgbW91bnRlZDogbWVyZ2VBc0FycmF5LFxuICBiZWZvcmVVcGRhdGU6IG1lcmdlQXNBcnJheSxcbiAgdXBkYXRlZDogbWVyZ2VBc0FycmF5LFxuICBiZWZvcmVEZXN0cm95OiBtZXJnZUFzQXJyYXksXG4gIGJlZm9yZVVubW91bnQ6IG1lcmdlQXNBcnJheSxcbiAgZGVzdHJveWVkOiBtZXJnZUFzQXJyYXksXG4gIHVubW91bnRlZDogbWVyZ2VBc0FycmF5LFxuICBhY3RpdmF0ZWQ6IG1lcmdlQXNBcnJheSxcbiAgZGVhY3RpdmF0ZWQ6IG1lcmdlQXNBcnJheSxcbiAgZXJyb3JDYXB0dXJlZDogbWVyZ2VBc0FycmF5LFxuICBzZXJ2ZXJQcmVmZXRjaDogbWVyZ2VBc0FycmF5LFxuICAvLyBhc3NldHNcbiAgY29tcG9uZW50czogbWVyZ2VPYmplY3RPcHRpb25zLFxuICBkaXJlY3RpdmVzOiBtZXJnZU9iamVjdE9wdGlvbnMsXG4gIC8vIHdhdGNoXG4gIHdhdGNoOiBtZXJnZVdhdGNoT3B0aW9ucyxcbiAgLy8gcHJvdmlkZSAvIGluamVjdFxuICBwcm92aWRlOiBtZXJnZURhdGFGbixcbiAgaW5qZWN0OiBtZXJnZUluamVjdFxufTtcbmZ1bmN0aW9uIG1lcmdlRGF0YUZuKHRvLCBmcm9tKSB7XG4gIGlmICghZnJvbSkge1xuICAgIHJldHVybiB0bztcbiAgfVxuICBpZiAoIXRvKSB7XG4gICAgcmV0dXJuIGZyb207XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbigpIHtcbiAgICByZXR1cm4gKGV4dGVuZCkoXG4gICAgICBpc0Z1bmN0aW9uKHRvKSA/IHRvLmNhbGwodGhpcywgdGhpcykgOiB0byxcbiAgICAgIGlzRnVuY3Rpb24oZnJvbSkgPyBmcm9tLmNhbGwodGhpcywgdGhpcykgOiBmcm9tXG4gICAgKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIG1lcmdlSW5qZWN0KHRvLCBmcm9tKSB7XG4gIHJldHVybiBtZXJnZU9iamVjdE9wdGlvbnMobm9ybWFsaXplSW5qZWN0KHRvKSwgbm9ybWFsaXplSW5qZWN0KGZyb20pKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZUluamVjdChyYXcpIHtcbiAgaWYgKGlzQXJyYXkocmF3KSkge1xuICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmF3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXNbcmF3W2ldXSA9IHJhd1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuICByZXR1cm4gcmF3O1xufVxuZnVuY3Rpb24gbWVyZ2VBc0FycmF5KHRvLCBmcm9tKSB7XG4gIHJldHVybiB0byA/IFsuLi5uZXcgU2V0KFtdLmNvbmNhdCh0bywgZnJvbSkpXSA6IGZyb207XG59XG5mdW5jdGlvbiBtZXJnZU9iamVjdE9wdGlvbnModG8sIGZyb20pIHtcbiAgcmV0dXJuIHRvID8gZXh0ZW5kKC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpLCB0bywgZnJvbSkgOiBmcm9tO1xufVxuZnVuY3Rpb24gbWVyZ2VFbWl0c09yUHJvcHNPcHRpb25zKHRvLCBmcm9tKSB7XG4gIGlmICh0bykge1xuICAgIGlmIChpc0FycmF5KHRvKSAmJiBpc0FycmF5KGZyb20pKSB7XG4gICAgICByZXR1cm4gWy4uLi8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFsuLi50bywgLi4uZnJvbV0pXTtcbiAgICB9XG4gICAgcmV0dXJuIGV4dGVuZChcbiAgICAgIC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgbm9ybWFsaXplUHJvcHNPckVtaXRzKHRvKSxcbiAgICAgIG5vcm1hbGl6ZVByb3BzT3JFbWl0cyhmcm9tICE9IG51bGwgPyBmcm9tIDoge30pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnJvbTtcbiAgfVxufVxuZnVuY3Rpb24gbWVyZ2VXYXRjaE9wdGlvbnModG8sIGZyb20pIHtcbiAgaWYgKCF0bylcbiAgICByZXR1cm4gZnJvbTtcbiAgaWYgKCFmcm9tKVxuICAgIHJldHVybiB0bztcbiAgY29uc3QgbWVyZ2VkID0gZXh0ZW5kKC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpLCB0byk7XG4gIGZvciAoY29uc3Qga2V5IGluIGZyb20pIHtcbiAgICBtZXJnZWRba2V5XSA9IG1lcmdlQXNBcnJheSh0b1trZXldLCBmcm9tW2tleV0pO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFwcENvbnRleHQoKSB7XG4gIHJldHVybiB7XG4gICAgYXBwOiBudWxsLFxuICAgIGNvbmZpZzoge1xuICAgICAgaXNOYXRpdmVUYWc6IE5PLFxuICAgICAgcGVyZm9ybWFuY2U6IGZhbHNlLFxuICAgICAgZ2xvYmFsUHJvcGVydGllczoge30sXG4gICAgICBvcHRpb25NZXJnZVN0cmF0ZWdpZXM6IHt9LFxuICAgICAgZXJyb3JIYW5kbGVyOiB2b2lkIDAsXG4gICAgICB3YXJuSGFuZGxlcjogdm9pZCAwLFxuICAgICAgY29tcGlsZXJPcHRpb25zOiB7fVxuICAgIH0sXG4gICAgbWl4aW5zOiBbXSxcbiAgICBjb21wb25lbnRzOiB7fSxcbiAgICBkaXJlY3RpdmVzOiB7fSxcbiAgICBwcm92aWRlczogLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgb3B0aW9uc0NhY2hlOiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSxcbiAgICBwcm9wc0NhY2hlOiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSxcbiAgICBlbWl0c0NhY2hlOiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKVxuICB9O1xufVxubGV0IHVpZCQxID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZUFwcEFQSShyZW5kZXIsIGh5ZHJhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUFwcChyb290Q29tcG9uZW50LCByb290UHJvcHMgPSBudWxsKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKHJvb3RDb21wb25lbnQpKSB7XG4gICAgICByb290Q29tcG9uZW50ID0gZXh0ZW5kKHt9LCByb290Q29tcG9uZW50KTtcbiAgICB9XG4gICAgaWYgKHJvb3RQcm9wcyAhPSBudWxsICYmICFpc09iamVjdChyb290UHJvcHMpKSB7XG4gICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYHJvb3QgcHJvcHMgcGFzc2VkIHRvIGFwcC5tb3VudCgpIG11c3QgYmUgYW4gb2JqZWN0LmApO1xuICAgICAgcm9vdFByb3BzID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY29udGV4dCA9IGNyZWF0ZUFwcENvbnRleHQoKTtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnRleHQuY29uZmlnLCBcInVud3JhcEluamVjdGVkUmVmXCIsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQoKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIGBhcHAuY29uZmlnLnVud3JhcEluamVjdGVkUmVmIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIDMuMyBub3cgYWxhd3lzIHVud3JhcHMgaW5qZWN0ZWQgcmVmcyBpbiBPcHRpb25zIEFQSS5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGluc3RhbGxlZFBsdWdpbnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICAgIGxldCBpc01vdW50ZWQgPSBmYWxzZTtcbiAgICBjb25zdCBhcHAgPSBjb250ZXh0LmFwcCA9IHtcbiAgICAgIF91aWQ6IHVpZCQxKyssXG4gICAgICBfY29tcG9uZW50OiByb290Q29tcG9uZW50LFxuICAgICAgX3Byb3BzOiByb290UHJvcHMsXG4gICAgICBfY29udGFpbmVyOiBudWxsLFxuICAgICAgX2NvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfaW5zdGFuY2U6IG51bGwsXG4gICAgICB2ZXJzaW9uLFxuICAgICAgZ2V0IGNvbmZpZygpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuY29uZmlnO1xuICAgICAgfSxcbiAgICAgIHNldCBjb25maWcodikge1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICBgYXBwLmNvbmZpZyBjYW5ub3QgYmUgcmVwbGFjZWQuIE1vZGlmeSBpbmRpdmlkdWFsIG9wdGlvbnMgaW5zdGVhZC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVzZShwbHVnaW4sIC4uLm9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGluc3RhbGxlZFBsdWdpbnMuaGFzKHBsdWdpbikpIHtcbiAgICAgICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYFBsdWdpbiBoYXMgYWxyZWFkeSBiZWVuIGFwcGxpZWQgdG8gdGFyZ2V0IGFwcC5gKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbHVnaW4gJiYgaXNGdW5jdGlvbihwbHVnaW4uaW5zdGFsbCkpIHtcbiAgICAgICAgICBpbnN0YWxsZWRQbHVnaW5zLmFkZChwbHVnaW4pO1xuICAgICAgICAgIHBsdWdpbi5pbnN0YWxsKGFwcCwgLi4ub3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihwbHVnaW4pKSB7XG4gICAgICAgICAgaW5zdGFsbGVkUGx1Z2lucy5hZGQocGx1Z2luKTtcbiAgICAgICAgICBwbHVnaW4oYXBwLCAuLi5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIGBBIHBsdWdpbiBtdXN0IGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGFuIG9iamVjdCB3aXRoIGFuIFwiaW5zdGFsbFwiIGZ1bmN0aW9uLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHA7XG4gICAgICB9LFxuICAgICAgbWl4aW4obWl4aW4pIHtcbiAgICAgICAgaWYgKF9fVlVFX09QVElPTlNfQVBJX18pIHtcbiAgICAgICAgICBpZiAoIWNvbnRleHQubWl4aW5zLmluY2x1ZGVzKG1peGluKSkge1xuICAgICAgICAgICAgY29udGV4dC5taXhpbnMucHVzaChtaXhpbik7XG4gICAgICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgICBcIk1peGluIGhhcyBhbHJlYWR5IGJlZW4gYXBwbGllZCB0byB0YXJnZXQgYXBwXCIgKyAobWl4aW4ubmFtZSA/IGA6ICR7bWl4aW4ubmFtZX1gIDogXCJcIilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB3YXJuKFwiTWl4aW5zIGFyZSBvbmx5IGF2YWlsYWJsZSBpbiBidWlsZHMgc3VwcG9ydGluZyBPcHRpb25zIEFQSVwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBwO1xuICAgICAgfSxcbiAgICAgIGNvbXBvbmVudChuYW1lLCBjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB2YWxpZGF0ZUNvbXBvbmVudE5hbWUobmFtZSwgY29udGV4dC5jb25maWcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuY29tcG9uZW50c1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBjb250ZXh0LmNvbXBvbmVudHNbbmFtZV0pIHtcbiAgICAgICAgICB3YXJuKGBDb21wb25lbnQgXCIke25hbWV9XCIgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGluIHRhcmdldCBhcHAuYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5jb21wb25lbnRzW25hbWVdID0gY29tcG9uZW50O1xuICAgICAgICByZXR1cm4gYXBwO1xuICAgICAgfSxcbiAgICAgIGRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmUpIHtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB2YWxpZGF0ZURpcmVjdGl2ZU5hbWUobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkaXJlY3RpdmUpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5kaXJlY3RpdmVzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGNvbnRleHQuZGlyZWN0aXZlc1tuYW1lXSkge1xuICAgICAgICAgIHdhcm4oYERpcmVjdGl2ZSBcIiR7bmFtZX1cIiBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgaW4gdGFyZ2V0IGFwcC5gKTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0LmRpcmVjdGl2ZXNbbmFtZV0gPSBkaXJlY3RpdmU7XG4gICAgICAgIHJldHVybiBhcHA7XG4gICAgICB9LFxuICAgICAgbW91bnQocm9vdENvbnRhaW5lciwgaXNIeWRyYXRlLCBpc1NWRykge1xuICAgICAgICBpZiAoIWlzTW91bnRlZCkge1xuICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHJvb3RDb250YWluZXIuX192dWVfYXBwX18pIHtcbiAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgIGBUaGVyZSBpcyBhbHJlYWR5IGFuIGFwcCBpbnN0YW5jZSBtb3VudGVkIG9uIHRoZSBob3N0IGNvbnRhaW5lci5cbiBJZiB5b3Ugd2FudCB0byBtb3VudCBhbm90aGVyIGFwcCBvbiB0aGUgc2FtZSBob3N0IGNvbnRhaW5lciwgeW91IG5lZWQgdG8gdW5tb3VudCB0aGUgcHJldmlvdXMgYXBwIGJ5IGNhbGxpbmcgXFxgYXBwLnVubW91bnQoKVxcYCBmaXJzdC5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB2bm9kZSA9IGNyZWF0ZVZOb2RlKFxuICAgICAgICAgICAgcm9vdENvbXBvbmVudCxcbiAgICAgICAgICAgIHJvb3RQcm9wc1xuICAgICAgICAgICk7XG4gICAgICAgICAgdm5vZGUuYXBwQ29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVsb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICByZW5kZXIoY2xvbmVWTm9kZSh2bm9kZSksIHJvb3RDb250YWluZXIsIGlzU1ZHKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0h5ZHJhdGUgJiYgaHlkcmF0ZSkge1xuICAgICAgICAgICAgaHlkcmF0ZSh2bm9kZSwgcm9vdENvbnRhaW5lcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbmRlcih2bm9kZSwgcm9vdENvbnRhaW5lciwgaXNTVkcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpc01vdW50ZWQgPSB0cnVlO1xuICAgICAgICAgIGFwcC5fY29udGFpbmVyID0gcm9vdENvbnRhaW5lcjtcbiAgICAgICAgICByb290Q29udGFpbmVyLl9fdnVlX2FwcF9fID0gYXBwO1xuICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgICAgICAgICAgYXBwLl9pbnN0YW5jZSA9IHZub2RlLmNvbXBvbmVudDtcbiAgICAgICAgICAgIGRldnRvb2xzSW5pdEFwcChhcHAsIHZlcnNpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ2V0RXhwb3NlUHJveHkodm5vZGUuY29tcG9uZW50KSB8fCB2bm9kZS5jb21wb25lbnQucHJveHk7XG4gICAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICBgQXBwIGhhcyBhbHJlYWR5IGJlZW4gbW91bnRlZC5cbklmIHlvdSB3YW50IHRvIHJlbW91bnQgdGhlIHNhbWUgYXBwLCBtb3ZlIHlvdXIgYXBwIGNyZWF0aW9uIGxvZ2ljIGludG8gYSBmYWN0b3J5IGZ1bmN0aW9uIGFuZCBjcmVhdGUgZnJlc2ggYXBwIGluc3RhbmNlcyBmb3IgZWFjaCBtb3VudCAtIGUuZy4gXFxgY29uc3QgY3JlYXRlTXlBcHAgPSAoKSA9PiBjcmVhdGVBcHAoQXBwKVxcYGBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdW5tb3VudCgpIHtcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xuICAgICAgICAgIHJlbmRlcihudWxsLCBhcHAuX2NvbnRhaW5lcik7XG4gICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSB7XG4gICAgICAgICAgICBhcHAuX2luc3RhbmNlID0gbnVsbDtcbiAgICAgICAgICAgIGRldnRvb2xzVW5tb3VudEFwcChhcHApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgYXBwLl9jb250YWluZXIuX192dWVfYXBwX187XG4gICAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHdhcm4oYENhbm5vdCB1bm1vdW50IGFuIGFwcCB0aGF0IGlzIG5vdCBtb3VudGVkLmApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvdmlkZShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGtleSBpbiBjb250ZXh0LnByb3ZpZGVzKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIGBBcHAgYWxyZWFkeSBwcm92aWRlcyBwcm9wZXJ0eSB3aXRoIGtleSBcIiR7U3RyaW5nKGtleSl9XCIuIEl0IHdpbGwgYmUgb3ZlcndyaXR0ZW4gd2l0aCB0aGUgbmV3IHZhbHVlLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQucHJvdmlkZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gYXBwO1xuICAgICAgfSxcbiAgICAgIHJ1bldpdGhDb250ZXh0KGZuKSB7XG4gICAgICAgIGN1cnJlbnRBcHAgPSBhcHA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgY3VycmVudEFwcCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhcHA7XG4gIH07XG59XG5sZXQgY3VycmVudEFwcCA9IG51bGw7XG5cbmZ1bmN0aW9uIHByb3ZpZGUoa2V5LCB2YWx1ZSkge1xuICBpZiAoIWN1cnJlbnRJbnN0YW5jZSkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICB3YXJuKGBwcm92aWRlKCkgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgc2V0dXAoKS5gKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGV0IHByb3ZpZGVzID0gY3VycmVudEluc3RhbmNlLnByb3ZpZGVzO1xuICAgIGNvbnN0IHBhcmVudFByb3ZpZGVzID0gY3VycmVudEluc3RhbmNlLnBhcmVudCAmJiBjdXJyZW50SW5zdGFuY2UucGFyZW50LnByb3ZpZGVzO1xuICAgIGlmIChwYXJlbnRQcm92aWRlcyA9PT0gcHJvdmlkZXMpIHtcbiAgICAgIHByb3ZpZGVzID0gY3VycmVudEluc3RhbmNlLnByb3ZpZGVzID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRQcm92aWRlcyk7XG4gICAgfVxuICAgIHByb3ZpZGVzW2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gaW5qZWN0KGtleSwgZGVmYXVsdFZhbHVlLCB0cmVhdERlZmF1bHRBc0ZhY3RvcnkgPSBmYWxzZSkge1xuICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnRJbnN0YW5jZSB8fCBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2U7XG4gIGlmIChpbnN0YW5jZSB8fCBjdXJyZW50QXBwKSB7XG4gICAgY29uc3QgcHJvdmlkZXMgPSBpbnN0YW5jZSA/IGluc3RhbmNlLnBhcmVudCA9PSBudWxsID8gaW5zdGFuY2Uudm5vZGUuYXBwQ29udGV4dCAmJiBpbnN0YW5jZS52bm9kZS5hcHBDb250ZXh0LnByb3ZpZGVzIDogaW5zdGFuY2UucGFyZW50LnByb3ZpZGVzIDogY3VycmVudEFwcC5fY29udGV4dC5wcm92aWRlcztcbiAgICBpZiAocHJvdmlkZXMgJiYga2V5IGluIHByb3ZpZGVzKSB7XG4gICAgICByZXR1cm4gcHJvdmlkZXNba2V5XTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdHJlYXREZWZhdWx0QXNGYWN0b3J5ICYmIGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSA/IGRlZmF1bHRWYWx1ZS5jYWxsKGluc3RhbmNlICYmIGluc3RhbmNlLnByb3h5KSA6IGRlZmF1bHRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIHdhcm4oYGluamVjdGlvbiBcIiR7U3RyaW5nKGtleSl9XCIgbm90IGZvdW5kLmApO1xuICAgIH1cbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihgaW5qZWN0KCkgY2FuIG9ubHkgYmUgdXNlZCBpbnNpZGUgc2V0dXAoKSBvciBmdW5jdGlvbmFsIGNvbXBvbmVudHMuYCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhc0luamVjdGlvbkNvbnRleHQoKSB7XG4gIHJldHVybiAhIShjdXJyZW50SW5zdGFuY2UgfHwgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlIHx8IGN1cnJlbnRBcHApO1xufVxuXG5mdW5jdGlvbiBpbml0UHJvcHMoaW5zdGFuY2UsIHJhd1Byb3BzLCBpc1N0YXRlZnVsLCBpc1NTUiA9IGZhbHNlKSB7XG4gIGNvbnN0IHByb3BzID0ge307XG4gIGNvbnN0IGF0dHJzID0ge307XG4gIGRlZihhdHRycywgSW50ZXJuYWxPYmplY3RLZXksIDEpO1xuICBpbnN0YW5jZS5wcm9wc0RlZmF1bHRzID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHNldEZ1bGxQcm9wcyhpbnN0YW5jZSwgcmF3UHJvcHMsIHByb3BzLCBhdHRycyk7XG4gIGZvciAoY29uc3Qga2V5IGluIGluc3RhbmNlLnByb3BzT3B0aW9uc1swXSkge1xuICAgIGlmICghKGtleSBpbiBwcm9wcykpIHtcbiAgICAgIHByb3BzW2tleV0gPSB2b2lkIDA7XG4gICAgfVxuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgdmFsaWRhdGVQcm9wcyhyYXdQcm9wcyB8fCB7fSwgcHJvcHMsIGluc3RhbmNlKTtcbiAgfVxuICBpZiAoaXNTdGF0ZWZ1bCkge1xuICAgIGluc3RhbmNlLnByb3BzID0gaXNTU1IgPyBwcm9wcyA6IHNoYWxsb3dSZWFjdGl2ZShwcm9wcyk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFpbnN0YW5jZS50eXBlLnByb3BzKSB7XG4gICAgICBpbnN0YW5jZS5wcm9wcyA9IGF0dHJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnN0YW5jZS5wcm9wcyA9IHByb3BzO1xuICAgIH1cbiAgfVxuICBpbnN0YW5jZS5hdHRycyA9IGF0dHJzO1xufVxuZnVuY3Rpb24gaXNJbkhtckNvbnRleHQoaW5zdGFuY2UpIHtcbiAgd2hpbGUgKGluc3RhbmNlKSB7XG4gICAgaWYgKGluc3RhbmNlLnR5cGUuX19obXJJZClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGluc3RhbmNlID0gaW5zdGFuY2UucGFyZW50O1xuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVQcm9wcyhpbnN0YW5jZSwgcmF3UHJvcHMsIHJhd1ByZXZQcm9wcywgb3B0aW1pemVkKSB7XG4gIGNvbnN0IHtcbiAgICBwcm9wcyxcbiAgICBhdHRycyxcbiAgICB2bm9kZTogeyBwYXRjaEZsYWcgfVxuICB9ID0gaW5zdGFuY2U7XG4gIGNvbnN0IHJhd0N1cnJlbnRQcm9wcyA9IHRvUmF3KHByb3BzKTtcbiAgY29uc3QgW29wdGlvbnNdID0gaW5zdGFuY2UucHJvcHNPcHRpb25zO1xuICBsZXQgaGFzQXR0cnNDaGFuZ2VkID0gZmFsc2U7XG4gIGlmIChcbiAgICAvLyBhbHdheXMgZm9yY2UgZnVsbCBkaWZmIGluIGRldlxuICAgIC8vIC0gIzE5NDIgaWYgaG1yIGlzIGVuYWJsZWQgd2l0aCBzZmMgY29tcG9uZW50XG4gICAgLy8gLSB2aXRlIzg3MiBub24tc2ZjIGNvbXBvbmVudCB1c2VkIGJ5IHNmYyBjb21wb25lbnRcbiAgICAhKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgaXNJbkhtckNvbnRleHQoaW5zdGFuY2UpKSAmJiAob3B0aW1pemVkIHx8IHBhdGNoRmxhZyA+IDApICYmICEocGF0Y2hGbGFnICYgMTYpXG4gICkge1xuICAgIGlmIChwYXRjaEZsYWcgJiA4KSB7XG4gICAgICBjb25zdCBwcm9wc1RvVXBkYXRlID0gaW5zdGFuY2Uudm5vZGUuZHluYW1pY1Byb3BzO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wc1RvVXBkYXRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgPSBwcm9wc1RvVXBkYXRlW2ldO1xuICAgICAgICBpZiAoaXNFbWl0TGlzdGVuZXIoaW5zdGFuY2UuZW1pdHNPcHRpb25zLCBrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSByYXdQcm9wc1trZXldO1xuICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgIGlmIChoYXNPd24oYXR0cnMsIGtleSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gYXR0cnNba2V5XSkge1xuICAgICAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgIGhhc0F0dHJzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVsaXplZEtleSA9IGNhbWVsaXplKGtleSk7XG4gICAgICAgICAgICBwcm9wc1tjYW1lbGl6ZWRLZXldID0gcmVzb2x2ZVByb3BWYWx1ZShcbiAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgcmF3Q3VycmVudFByb3BzLFxuICAgICAgICAgICAgICBjYW1lbGl6ZWRLZXksXG4gICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgLyogaXNBYnNlbnQgKi9cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gYXR0cnNba2V5XSkge1xuICAgICAgICAgICAgYXR0cnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgaGFzQXR0cnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHNldEZ1bGxQcm9wcyhpbnN0YW5jZSwgcmF3UHJvcHMsIHByb3BzLCBhdHRycykpIHtcbiAgICAgIGhhc0F0dHJzQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICAgIGxldCBrZWJhYktleTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByYXdDdXJyZW50UHJvcHMpIHtcbiAgICAgIGlmICghcmF3UHJvcHMgfHwgLy8gZm9yIGNhbWVsQ2FzZVxuICAgICAgIWhhc093bihyYXdQcm9wcywga2V5KSAmJiAvLyBpdCdzIHBvc3NpYmxlIHRoZSBvcmlnaW5hbCBwcm9wcyB3YXMgcGFzc2VkIGluIGFzIGtlYmFiLWNhc2VcbiAgICAgIC8vIGFuZCBjb252ZXJ0ZWQgdG8gY2FtZWxDYXNlICgjOTU1KVxuICAgICAgKChrZWJhYktleSA9IGh5cGhlbmF0ZShrZXkpKSA9PT0ga2V5IHx8ICFoYXNPd24ocmF3UHJvcHMsIGtlYmFiS2V5KSkpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBpZiAocmF3UHJldlByb3BzICYmIC8vIGZvciBjYW1lbENhc2VcbiAgICAgICAgICAocmF3UHJldlByb3BzW2tleV0gIT09IHZvaWQgMCB8fCAvLyBmb3Iga2ViYWItY2FzZVxuICAgICAgICAgIHJhd1ByZXZQcm9wc1trZWJhYktleV0gIT09IHZvaWQgMCkpIHtcbiAgICAgICAgICAgIHByb3BzW2tleV0gPSByZXNvbHZlUHJvcFZhbHVlKFxuICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICByYXdDdXJyZW50UHJvcHMsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgICAvKiBpc0Fic2VudCAqL1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHByb3BzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF0dHJzICE9PSByYXdDdXJyZW50UHJvcHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIGlmICghcmF3UHJvcHMgfHwgIWhhc093bihyYXdQcm9wcywga2V5KSAmJiB0cnVlKSB7XG4gICAgICAgICAgZGVsZXRlIGF0dHJzW2tleV07XG4gICAgICAgICAgaGFzQXR0cnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoaGFzQXR0cnNDaGFuZ2VkKSB7XG4gICAgdHJpZ2dlcihpbnN0YW5jZSwgXCJzZXRcIiwgXCIkYXR0cnNcIik7XG4gIH1cbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICB2YWxpZGF0ZVByb3BzKHJhd1Byb3BzIHx8IHt9LCBwcm9wcywgaW5zdGFuY2UpO1xuICB9XG59XG5mdW5jdGlvbiBzZXRGdWxsUHJvcHMoaW5zdGFuY2UsIHJhd1Byb3BzLCBwcm9wcywgYXR0cnMpIHtcbiAgY29uc3QgW29wdGlvbnMsIG5lZWRDYXN0S2V5c10gPSBpbnN0YW5jZS5wcm9wc09wdGlvbnM7XG4gIGxldCBoYXNBdHRyc0NoYW5nZWQgPSBmYWxzZTtcbiAgbGV0IHJhd0Nhc3RWYWx1ZXM7XG4gIGlmIChyYXdQcm9wcykge1xuICAgIGZvciAobGV0IGtleSBpbiByYXdQcm9wcykge1xuICAgICAgaWYgKGlzUmVzZXJ2ZWRQcm9wKGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZSA9IHJhd1Byb3BzW2tleV07XG4gICAgICBsZXQgY2FtZWxLZXk7XG4gICAgICBpZiAob3B0aW9ucyAmJiBoYXNPd24ob3B0aW9ucywgY2FtZWxLZXkgPSBjYW1lbGl6ZShrZXkpKSkge1xuICAgICAgICBpZiAoIW5lZWRDYXN0S2V5cyB8fCAhbmVlZENhc3RLZXlzLmluY2x1ZGVzKGNhbWVsS2V5KSkge1xuICAgICAgICAgIHByb3BzW2NhbWVsS2V5XSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIChyYXdDYXN0VmFsdWVzIHx8IChyYXdDYXN0VmFsdWVzID0ge30pKVtjYW1lbEtleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghaXNFbWl0TGlzdGVuZXIoaW5zdGFuY2UuZW1pdHNPcHRpb25zLCBrZXkpKSB7XG4gICAgICAgIGlmICghKGtleSBpbiBhdHRycykgfHwgdmFsdWUgIT09IGF0dHJzW2tleV0pIHtcbiAgICAgICAgICBhdHRyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgaGFzQXR0cnNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAobmVlZENhc3RLZXlzKSB7XG4gICAgY29uc3QgcmF3Q3VycmVudFByb3BzID0gdG9SYXcocHJvcHMpO1xuICAgIGNvbnN0IGNhc3RWYWx1ZXMgPSByYXdDYXN0VmFsdWVzIHx8IEVNUFRZX09CSjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5lZWRDYXN0S2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0gbmVlZENhc3RLZXlzW2ldO1xuICAgICAgcHJvcHNba2V5XSA9IHJlc29sdmVQcm9wVmFsdWUoXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIHJhd0N1cnJlbnRQcm9wcyxcbiAgICAgICAga2V5LFxuICAgICAgICBjYXN0VmFsdWVzW2tleV0sXG4gICAgICAgIGluc3RhbmNlLFxuICAgICAgICAhaGFzT3duKGNhc3RWYWx1ZXMsIGtleSlcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBoYXNBdHRyc0NoYW5nZWQ7XG59XG5mdW5jdGlvbiByZXNvbHZlUHJvcFZhbHVlKG9wdGlvbnMsIHByb3BzLCBrZXksIHZhbHVlLCBpbnN0YW5jZSwgaXNBYnNlbnQpIHtcbiAgY29uc3Qgb3B0ID0gb3B0aW9uc1trZXldO1xuICBpZiAob3B0ICE9IG51bGwpIHtcbiAgICBjb25zdCBoYXNEZWZhdWx0ID0gaGFzT3duKG9wdCwgXCJkZWZhdWx0XCIpO1xuICAgIGlmIChoYXNEZWZhdWx0ICYmIHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IG9wdC5kZWZhdWx0O1xuICAgICAgaWYgKG9wdC50eXBlICE9PSBGdW5jdGlvbiAmJiAhb3B0LnNraXBGYWN0b3J5ICYmIGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICBjb25zdCB7IHByb3BzRGVmYXVsdHMgfSA9IGluc3RhbmNlO1xuICAgICAgICBpZiAoa2V5IGluIHByb3BzRGVmYXVsdHMpIHtcbiAgICAgICAgICB2YWx1ZSA9IHByb3BzRGVmYXVsdHNba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRDdXJyZW50SW5zdGFuY2UoaW5zdGFuY2UpO1xuICAgICAgICAgIHZhbHVlID0gcHJvcHNEZWZhdWx0c1trZXldID0gZGVmYXVsdFZhbHVlLmNhbGwoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgcHJvcHNcbiAgICAgICAgICApO1xuICAgICAgICAgIHVuc2V0Q3VycmVudEluc3RhbmNlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0WzAgLyogc2hvdWxkQ2FzdCAqL10pIHtcbiAgICAgIGlmIChpc0Fic2VudCAmJiAhaGFzRGVmYXVsdCkge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChvcHRbMSAvKiBzaG91bGRDYXN0VHJ1ZSAqL10gJiYgKHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSBoeXBoZW5hdGUoa2V5KSkpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBub3JtYWxpemVQcm9wc09wdGlvbnMoY29tcCwgYXBwQ29udGV4dCwgYXNNaXhpbiA9IGZhbHNlKSB7XG4gIGNvbnN0IGNhY2hlID0gYXBwQ29udGV4dC5wcm9wc0NhY2hlO1xuICBjb25zdCBjYWNoZWQgPSBjYWNoZS5nZXQoY29tcCk7XG4gIGlmIChjYWNoZWQpIHtcbiAgICByZXR1cm4gY2FjaGVkO1xuICB9XG4gIGNvbnN0IHJhdyA9IGNvbXAucHJvcHM7XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fTtcbiAgY29uc3QgbmVlZENhc3RLZXlzID0gW107XG4gIGxldCBoYXNFeHRlbmRzID0gZmFsc2U7XG4gIGlmIChfX1ZVRV9PUFRJT05TX0FQSV9fICYmICFpc0Z1bmN0aW9uKGNvbXApKSB7XG4gICAgY29uc3QgZXh0ZW5kUHJvcHMgPSAocmF3MikgPT4ge1xuICAgICAgaGFzRXh0ZW5kcyA9IHRydWU7XG4gICAgICBjb25zdCBbcHJvcHMsIGtleXNdID0gbm9ybWFsaXplUHJvcHNPcHRpb25zKHJhdzIsIGFwcENvbnRleHQsIHRydWUpO1xuICAgICAgZXh0ZW5kKG5vcm1hbGl6ZWQsIHByb3BzKTtcbiAgICAgIGlmIChrZXlzKVxuICAgICAgICBuZWVkQ2FzdEtleXMucHVzaCguLi5rZXlzKTtcbiAgICB9O1xuICAgIGlmICghYXNNaXhpbiAmJiBhcHBDb250ZXh0Lm1peGlucy5sZW5ndGgpIHtcbiAgICAgIGFwcENvbnRleHQubWl4aW5zLmZvckVhY2goZXh0ZW5kUHJvcHMpO1xuICAgIH1cbiAgICBpZiAoY29tcC5leHRlbmRzKSB7XG4gICAgICBleHRlbmRQcm9wcyhjb21wLmV4dGVuZHMpO1xuICAgIH1cbiAgICBpZiAoY29tcC5taXhpbnMpIHtcbiAgICAgIGNvbXAubWl4aW5zLmZvckVhY2goZXh0ZW5kUHJvcHMpO1xuICAgIH1cbiAgfVxuICBpZiAoIXJhdyAmJiAhaGFzRXh0ZW5kcykge1xuICAgIGlmIChpc09iamVjdChjb21wKSkge1xuICAgICAgY2FjaGUuc2V0KGNvbXAsIEVNUFRZX0FSUik7XG4gICAgfVxuICAgIHJldHVybiBFTVBUWV9BUlI7XG4gIH1cbiAgaWYgKGlzQXJyYXkocmF3KSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmF3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaXNTdHJpbmcocmF3W2ldKSkge1xuICAgICAgICB3YXJuKGBwcm9wcyBtdXN0IGJlIHN0cmluZ3Mgd2hlbiB1c2luZyBhcnJheSBzeW50YXguYCwgcmF3W2ldKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRLZXkgPSBjYW1lbGl6ZShyYXdbaV0pO1xuICAgICAgaWYgKHZhbGlkYXRlUHJvcE5hbWUobm9ybWFsaXplZEtleSkpIHtcbiAgICAgICAgbm9ybWFsaXplZFtub3JtYWxpemVkS2V5XSA9IEVNUFRZX09CSjtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAocmF3KSB7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWlzT2JqZWN0KHJhdykpIHtcbiAgICAgIHdhcm4oYGludmFsaWQgcHJvcHMgb3B0aW9uc2AsIHJhdyk7XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHJhdykge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZEtleSA9IGNhbWVsaXplKGtleSk7XG4gICAgICBpZiAodmFsaWRhdGVQcm9wTmFtZShub3JtYWxpemVkS2V5KSkge1xuICAgICAgICBjb25zdCBvcHQgPSByYXdba2V5XTtcbiAgICAgICAgY29uc3QgcHJvcCA9IG5vcm1hbGl6ZWRbbm9ybWFsaXplZEtleV0gPSBpc0FycmF5KG9wdCkgfHwgaXNGdW5jdGlvbihvcHQpID8geyB0eXBlOiBvcHQgfSA6IGV4dGVuZCh7fSwgb3B0KTtcbiAgICAgICAgaWYgKHByb3ApIHtcbiAgICAgICAgICBjb25zdCBib29sZWFuSW5kZXggPSBnZXRUeXBlSW5kZXgoQm9vbGVhbiwgcHJvcC50eXBlKTtcbiAgICAgICAgICBjb25zdCBzdHJpbmdJbmRleCA9IGdldFR5cGVJbmRleChTdHJpbmcsIHByb3AudHlwZSk7XG4gICAgICAgICAgcHJvcFswIC8qIHNob3VsZENhc3QgKi9dID0gYm9vbGVhbkluZGV4ID4gLTE7XG4gICAgICAgICAgcHJvcFsxIC8qIHNob3VsZENhc3RUcnVlICovXSA9IHN0cmluZ0luZGV4IDwgMCB8fCBib29sZWFuSW5kZXggPCBzdHJpbmdJbmRleDtcbiAgICAgICAgICBpZiAoYm9vbGVhbkluZGV4ID4gLTEgfHwgaGFzT3duKHByb3AsIFwiZGVmYXVsdFwiKSkge1xuICAgICAgICAgICAgbmVlZENhc3RLZXlzLnB1c2gobm9ybWFsaXplZEtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNvbnN0IHJlcyA9IFtub3JtYWxpemVkLCBuZWVkQ2FzdEtleXNdO1xuICBpZiAoaXNPYmplY3QoY29tcCkpIHtcbiAgICBjYWNoZS5zZXQoY29tcCwgcmVzKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVQcm9wTmFtZShrZXkpIHtcbiAgaWYgKGtleVswXSAhPT0gXCIkXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihgSW52YWxpZCBwcm9wIG5hbWU6IFwiJHtrZXl9XCIgaXMgYSByZXNlcnZlZCBwcm9wZXJ0eS5gKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBnZXRUeXBlKGN0b3IpIHtcbiAgY29uc3QgbWF0Y2ggPSBjdG9yICYmIGN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXlxccyooZnVuY3Rpb258Y2xhc3MpIChcXHcrKS8pO1xuICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsyXSA6IGN0b3IgPT09IG51bGwgPyBcIm51bGxcIiA6IFwiXCI7XG59XG5mdW5jdGlvbiBpc1NhbWVUeXBlKGEsIGIpIHtcbiAgcmV0dXJuIGdldFR5cGUoYSkgPT09IGdldFR5cGUoYik7XG59XG5mdW5jdGlvbiBnZXRUeXBlSW5kZXgodHlwZSwgZXhwZWN0ZWRUeXBlcykge1xuICBpZiAoaXNBcnJheShleHBlY3RlZFR5cGVzKSkge1xuICAgIHJldHVybiBleHBlY3RlZFR5cGVzLmZpbmRJbmRleCgodCkgPT4gaXNTYW1lVHlwZSh0LCB0eXBlKSk7XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihleHBlY3RlZFR5cGVzKSkge1xuICAgIHJldHVybiBpc1NhbWVUeXBlKGV4cGVjdGVkVHlwZXMsIHR5cGUpID8gMCA6IC0xO1xuICB9XG4gIHJldHVybiAtMTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcHMocmF3UHJvcHMsIHByb3BzLCBpbnN0YW5jZSkge1xuICBjb25zdCByZXNvbHZlZFZhbHVlcyA9IHRvUmF3KHByb3BzKTtcbiAgY29uc3Qgb3B0aW9ucyA9IGluc3RhbmNlLnByb3BzT3B0aW9uc1swXTtcbiAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgIGxldCBvcHQgPSBvcHRpb25zW2tleV07XG4gICAgaWYgKG9wdCA9PSBudWxsKVxuICAgICAgY29udGludWU7XG4gICAgdmFsaWRhdGVQcm9wKFxuICAgICAga2V5LFxuICAgICAgcmVzb2x2ZWRWYWx1ZXNba2V5XSxcbiAgICAgIG9wdCxcbiAgICAgICFoYXNPd24ocmF3UHJvcHMsIGtleSkgJiYgIWhhc093bihyYXdQcm9wcywgaHlwaGVuYXRlKGtleSkpXG4gICAgKTtcbiAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVQcm9wKG5hbWUsIHZhbHVlLCBwcm9wLCBpc0Fic2VudCkge1xuICBjb25zdCB7IHR5cGUsIHJlcXVpcmVkLCB2YWxpZGF0b3IsIHNraXBDaGVjayB9ID0gcHJvcDtcbiAgaWYgKHJlcXVpcmVkICYmIGlzQWJzZW50KSB7XG4gICAgd2FybignTWlzc2luZyByZXF1aXJlZCBwcm9wOiBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsICYmICFyZXF1aXJlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZSAhPSBudWxsICYmIHR5cGUgIT09IHRydWUgJiYgIXNraXBDaGVjaykge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgY29uc3QgdHlwZXMgPSBpc0FycmF5KHR5cGUpID8gdHlwZSA6IFt0eXBlXTtcbiAgICBjb25zdCBleHBlY3RlZFR5cGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGggJiYgIWlzVmFsaWQ7IGkrKykge1xuICAgICAgY29uc3QgeyB2YWxpZCwgZXhwZWN0ZWRUeXBlIH0gPSBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlc1tpXSk7XG4gICAgICBleHBlY3RlZFR5cGVzLnB1c2goZXhwZWN0ZWRUeXBlIHx8IFwiXCIpO1xuICAgICAgaXNWYWxpZCA9IHZhbGlkO1xuICAgIH1cbiAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgIHdhcm4oZ2V0SW52YWxpZFR5cGVNZXNzYWdlKG5hbWUsIHZhbHVlLCBleHBlY3RlZFR5cGVzKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIGlmICh2YWxpZGF0b3IgJiYgIXZhbGlkYXRvcih2YWx1ZSkpIHtcbiAgICB3YXJuKCdJbnZhbGlkIHByb3A6IGN1c3RvbSB2YWxpZGF0b3IgY2hlY2sgZmFpbGVkIGZvciBwcm9wIFwiJyArIG5hbWUgKyAnXCIuJyk7XG4gIH1cbn1cbmNvbnN0IGlzU2ltcGxlVHlwZSA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKFxuICBcIlN0cmluZyxOdW1iZXIsQm9vbGVhbixGdW5jdGlvbixTeW1ib2wsQmlnSW50XCJcbik7XG5mdW5jdGlvbiBhc3NlcnRUeXBlKHZhbHVlLCB0eXBlKSB7XG4gIGxldCB2YWxpZDtcbiAgY29uc3QgZXhwZWN0ZWRUeXBlID0gZ2V0VHlwZSh0eXBlKTtcbiAgaWYgKGlzU2ltcGxlVHlwZShleHBlY3RlZFR5cGUpKSB7XG4gICAgY29uc3QgdCA9IHR5cGVvZiB2YWx1ZTtcbiAgICB2YWxpZCA9IHQgPT09IGV4cGVjdGVkVHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghdmFsaWQgJiYgdCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgdmFsaWQgPSB2YWx1ZSBpbnN0YW5jZW9mIHR5cGU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gXCJPYmplY3RcIikge1xuICAgIHZhbGlkID0gaXNPYmplY3QodmFsdWUpO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkVHlwZSA9PT0gXCJBcnJheVwiKSB7XG4gICAgdmFsaWQgPSBpc0FycmF5KHZhbHVlKTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZFR5cGUgPT09IFwibnVsbFwiKSB7XG4gICAgdmFsaWQgPSB2YWx1ZSA9PT0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZCA9IHZhbHVlIGluc3RhbmNlb2YgdHlwZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHZhbGlkLFxuICAgIGV4cGVjdGVkVHlwZVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0SW52YWxpZFR5cGVNZXNzYWdlKG5hbWUsIHZhbHVlLCBleHBlY3RlZFR5cGVzKSB7XG4gIGxldCBtZXNzYWdlID0gYEludmFsaWQgcHJvcDogdHlwZSBjaGVjayBmYWlsZWQgZm9yIHByb3AgXCIke25hbWV9XCIuIEV4cGVjdGVkICR7ZXhwZWN0ZWRUeXBlcy5tYXAoY2FwaXRhbGl6ZSkuam9pbihcIiB8IFwiKX1gO1xuICBjb25zdCBleHBlY3RlZFR5cGUgPSBleHBlY3RlZFR5cGVzWzBdO1xuICBjb25zdCByZWNlaXZlZFR5cGUgPSB0b1Jhd1R5cGUodmFsdWUpO1xuICBjb25zdCBleHBlY3RlZFZhbHVlID0gc3R5bGVWYWx1ZSh2YWx1ZSwgZXhwZWN0ZWRUeXBlKTtcbiAgY29uc3QgcmVjZWl2ZWRWYWx1ZSA9IHN0eWxlVmFsdWUodmFsdWUsIHJlY2VpdmVkVHlwZSk7XG4gIGlmIChleHBlY3RlZFR5cGVzLmxlbmd0aCA9PT0gMSAmJiBpc0V4cGxpY2FibGUoZXhwZWN0ZWRUeXBlKSAmJiAhaXNCb29sZWFuKGV4cGVjdGVkVHlwZSwgcmVjZWl2ZWRUeXBlKSkge1xuICAgIG1lc3NhZ2UgKz0gYCB3aXRoIHZhbHVlICR7ZXhwZWN0ZWRWYWx1ZX1gO1xuICB9XG4gIG1lc3NhZ2UgKz0gYCwgZ290ICR7cmVjZWl2ZWRUeXBlfSBgO1xuICBpZiAoaXNFeHBsaWNhYmxlKHJlY2VpdmVkVHlwZSkpIHtcbiAgICBtZXNzYWdlICs9IGB3aXRoIHZhbHVlICR7cmVjZWl2ZWRWYWx1ZX0uYDtcbiAgfVxuICByZXR1cm4gbWVzc2FnZTtcbn1cbmZ1bmN0aW9uIHN0eWxlVmFsdWUodmFsdWUsIHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09IFwiU3RyaW5nXCIpIHtcbiAgICByZXR1cm4gYFwiJHt2YWx1ZX1cImA7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJOdW1iZXJcIikge1xuICAgIHJldHVybiBgJHtOdW1iZXIodmFsdWUpfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzRXhwbGljYWJsZSh0eXBlKSB7XG4gIGNvbnN0IGV4cGxpY2l0VHlwZXMgPSBbXCJzdHJpbmdcIiwgXCJudW1iZXJcIiwgXCJib29sZWFuXCJdO1xuICByZXR1cm4gZXhwbGljaXRUeXBlcy5zb21lKChlbGVtKSA9PiB0eXBlLnRvTG93ZXJDYXNlKCkgPT09IGVsZW0pO1xufVxuZnVuY3Rpb24gaXNCb29sZWFuKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGFyZ3Muc29tZSgoZWxlbSkgPT4gZWxlbS50b0xvd2VyQ2FzZSgpID09PSBcImJvb2xlYW5cIik7XG59XG5cbmNvbnN0IGlzSW50ZXJuYWxLZXkgPSAoa2V5KSA9PiBrZXlbMF0gPT09IFwiX1wiIHx8IGtleSA9PT0gXCIkc3RhYmxlXCI7XG5jb25zdCBub3JtYWxpemVTbG90VmFsdWUgPSAodmFsdWUpID0+IGlzQXJyYXkodmFsdWUpID8gdmFsdWUubWFwKG5vcm1hbGl6ZVZOb2RlKSA6IFtub3JtYWxpemVWTm9kZSh2YWx1ZSldO1xuY29uc3Qgbm9ybWFsaXplU2xvdCA9IChrZXksIHJhd1Nsb3QsIGN0eCkgPT4ge1xuICBpZiAocmF3U2xvdC5fbikge1xuICAgIHJldHVybiByYXdTbG90O1xuICB9XG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB3aXRoQ3R4KCguLi5hcmdzKSA9PiB7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgY3VycmVudEluc3RhbmNlKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgU2xvdCBcIiR7a2V5fVwiIGludm9rZWQgb3V0c2lkZSBvZiB0aGUgcmVuZGVyIGZ1bmN0aW9uOiB0aGlzIHdpbGwgbm90IHRyYWNrIGRlcGVuZGVuY2llcyB1c2VkIGluIHRoZSBzbG90LiBJbnZva2UgdGhlIHNsb3QgZnVuY3Rpb24gaW5zaWRlIHRoZSByZW5kZXIgZnVuY3Rpb24gaW5zdGVhZC5gXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbm9ybWFsaXplU2xvdFZhbHVlKHJhd1Nsb3QoLi4uYXJncykpO1xuICB9LCBjdHgpO1xuICBub3JtYWxpemVkLl9jID0gZmFsc2U7XG4gIHJldHVybiBub3JtYWxpemVkO1xufTtcbmNvbnN0IG5vcm1hbGl6ZU9iamVjdFNsb3RzID0gKHJhd1Nsb3RzLCBzbG90cywgaW5zdGFuY2UpID0+IHtcbiAgY29uc3QgY3R4ID0gcmF3U2xvdHMuX2N0eDtcbiAgZm9yIChjb25zdCBrZXkgaW4gcmF3U2xvdHMpIHtcbiAgICBpZiAoaXNJbnRlcm5hbEtleShrZXkpKVxuICAgICAgY29udGludWU7XG4gICAgY29uc3QgdmFsdWUgPSByYXdTbG90c1trZXldO1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgc2xvdHNba2V5XSA9IG5vcm1hbGl6ZVNsb3Qoa2V5LCB2YWx1ZSwgY3R4KTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHRydWUpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgTm9uLWZ1bmN0aW9uIHZhbHVlIGVuY291bnRlcmVkIGZvciBzbG90IFwiJHtrZXl9XCIuIFByZWZlciBmdW5jdGlvbiBzbG90cyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbG90VmFsdWUodmFsdWUpO1xuICAgICAgc2xvdHNba2V5XSA9ICgpID0+IG5vcm1hbGl6ZWQ7XG4gICAgfVxuICB9XG59O1xuY29uc3Qgbm9ybWFsaXplVk5vZGVTbG90cyA9IChpbnN0YW5jZSwgY2hpbGRyZW4pID0+IHtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWlzS2VlcEFsaXZlKGluc3RhbmNlLnZub2RlKSAmJiB0cnVlKSB7XG4gICAgd2FybihcbiAgICAgIGBOb24tZnVuY3Rpb24gdmFsdWUgZW5jb3VudGVyZWQgZm9yIGRlZmF1bHQgc2xvdC4gUHJlZmVyIGZ1bmN0aW9uIHNsb3RzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuYFxuICAgICk7XG4gIH1cbiAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNsb3RWYWx1ZShjaGlsZHJlbik7XG4gIGluc3RhbmNlLnNsb3RzLmRlZmF1bHQgPSAoKSA9PiBub3JtYWxpemVkO1xufTtcbmNvbnN0IGluaXRTbG90cyA9IChpbnN0YW5jZSwgY2hpbGRyZW4pID0+IHtcbiAgaWYgKGluc3RhbmNlLnZub2RlLnNoYXBlRmxhZyAmIDMyKSB7XG4gICAgY29uc3QgdHlwZSA9IGNoaWxkcmVuLl87XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGluc3RhbmNlLnNsb3RzID0gdG9SYXcoY2hpbGRyZW4pO1xuICAgICAgZGVmKGNoaWxkcmVuLCBcIl9cIiwgdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vcm1hbGl6ZU9iamVjdFNsb3RzKFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgaW5zdGFuY2Uuc2xvdHMgPSB7fSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGluc3RhbmNlLnNsb3RzID0ge307XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICBub3JtYWxpemVWTm9kZVNsb3RzKGluc3RhbmNlLCBjaGlsZHJlbik7XG4gICAgfVxuICB9XG4gIGRlZihpbnN0YW5jZS5zbG90cywgSW50ZXJuYWxPYmplY3RLZXksIDEpO1xufTtcbmNvbnN0IHVwZGF0ZVNsb3RzID0gKGluc3RhbmNlLCBjaGlsZHJlbiwgb3B0aW1pemVkKSA9PiB7XG4gIGNvbnN0IHsgdm5vZGUsIHNsb3RzIH0gPSBpbnN0YW5jZTtcbiAgbGV0IG5lZWREZWxldGlvbkNoZWNrID0gdHJ1ZTtcbiAgbGV0IGRlbGV0aW9uQ29tcGFyaXNvblRhcmdldCA9IEVNUFRZX09CSjtcbiAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDMyKSB7XG4gICAgY29uc3QgdHlwZSA9IGNoaWxkcmVuLl87XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGlzSG1yVXBkYXRpbmcpIHtcbiAgICAgICAgZXh0ZW5kKHNsb3RzLCBjaGlsZHJlbik7XG4gICAgICAgIHRyaWdnZXIoaW5zdGFuY2UsIFwic2V0XCIsIFwiJHNsb3RzXCIpO1xuICAgICAgfSBlbHNlIGlmIChvcHRpbWl6ZWQgJiYgdHlwZSA9PT0gMSkge1xuICAgICAgICBuZWVkRGVsZXRpb25DaGVjayA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXh0ZW5kKHNsb3RzLCBjaGlsZHJlbik7XG4gICAgICAgIGlmICghb3B0aW1pemVkICYmIHR5cGUgPT09IDEpIHtcbiAgICAgICAgICBkZWxldGUgc2xvdHMuXztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZWVkRGVsZXRpb25DaGVjayA9ICFjaGlsZHJlbi4kc3RhYmxlO1xuICAgICAgbm9ybWFsaXplT2JqZWN0U2xvdHMoY2hpbGRyZW4sIHNsb3RzKTtcbiAgICB9XG4gICAgZGVsZXRpb25Db21wYXJpc29uVGFyZ2V0ID0gY2hpbGRyZW47XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW4pIHtcbiAgICBub3JtYWxpemVWTm9kZVNsb3RzKGluc3RhbmNlLCBjaGlsZHJlbik7XG4gICAgZGVsZXRpb25Db21wYXJpc29uVGFyZ2V0ID0geyBkZWZhdWx0OiAxIH07XG4gIH1cbiAgaWYgKG5lZWREZWxldGlvbkNoZWNrKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2xvdHMpIHtcbiAgICAgIGlmICghaXNJbnRlcm5hbEtleShrZXkpICYmICEoa2V5IGluIGRlbGV0aW9uQ29tcGFyaXNvblRhcmdldCkpIHtcbiAgICAgICAgZGVsZXRlIHNsb3RzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRSZWYocmF3UmVmLCBvbGRSYXdSZWYsIHBhcmVudFN1c3BlbnNlLCB2bm9kZSwgaXNVbm1vdW50ID0gZmFsc2UpIHtcbiAgaWYgKGlzQXJyYXkocmF3UmVmKSkge1xuICAgIHJhd1JlZi5mb3JFYWNoKFxuICAgICAgKHIsIGkpID0+IHNldFJlZihcbiAgICAgICAgcixcbiAgICAgICAgb2xkUmF3UmVmICYmIChpc0FycmF5KG9sZFJhd1JlZikgPyBvbGRSYXdSZWZbaV0gOiBvbGRSYXdSZWYpLFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgdm5vZGUsXG4gICAgICAgIGlzVW5tb3VudFxuICAgICAgKVxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpc0FzeW5jV3JhcHBlcih2bm9kZSkgJiYgIWlzVW5tb3VudCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCByZWZWYWx1ZSA9IHZub2RlLnNoYXBlRmxhZyAmIDQgPyBnZXRFeHBvc2VQcm94eSh2bm9kZS5jb21wb25lbnQpIHx8IHZub2RlLmNvbXBvbmVudC5wcm94eSA6IHZub2RlLmVsO1xuICBjb25zdCB2YWx1ZSA9IGlzVW5tb3VudCA/IG51bGwgOiByZWZWYWx1ZTtcbiAgY29uc3QgeyBpOiBvd25lciwgcjogcmVmIH0gPSByYXdSZWY7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFvd25lcikge1xuICAgIHdhcm4oXG4gICAgICBgTWlzc2luZyByZWYgb3duZXIgY29udGV4dC4gcmVmIGNhbm5vdCBiZSB1c2VkIG9uIGhvaXN0ZWQgdm5vZGVzLiBBIHZub2RlIHdpdGggcmVmIG11c3QgYmUgY3JlYXRlZCBpbnNpZGUgdGhlIHJlbmRlciBmdW5jdGlvbi5gXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgb2xkUmVmID0gb2xkUmF3UmVmICYmIG9sZFJhd1JlZi5yO1xuICBjb25zdCByZWZzID0gb3duZXIucmVmcyA9PT0gRU1QVFlfT0JKID8gb3duZXIucmVmcyA9IHt9IDogb3duZXIucmVmcztcbiAgY29uc3Qgc2V0dXBTdGF0ZSA9IG93bmVyLnNldHVwU3RhdGU7XG4gIGlmIChvbGRSZWYgIT0gbnVsbCAmJiBvbGRSZWYgIT09IHJlZikge1xuICAgIGlmIChpc1N0cmluZyhvbGRSZWYpKSB7XG4gICAgICByZWZzW29sZFJlZl0gPSBudWxsO1xuICAgICAgaWYgKGhhc093bihzZXR1cFN0YXRlLCBvbGRSZWYpKSB7XG4gICAgICAgIHNldHVwU3RhdGVbb2xkUmVmXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1JlZihvbGRSZWYpKSB7XG4gICAgICBvbGRSZWYudmFsdWUgPSBudWxsO1xuICAgIH1cbiAgfVxuICBpZiAoaXNGdW5jdGlvbihyZWYpKSB7XG4gICAgY2FsbFdpdGhFcnJvckhhbmRsaW5nKHJlZiwgb3duZXIsIDEyLCBbdmFsdWUsIHJlZnNdKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBfaXNTdHJpbmcgPSBpc1N0cmluZyhyZWYpO1xuICAgIGNvbnN0IF9pc1JlZiA9IGlzUmVmKHJlZik7XG4gICAgaWYgKF9pc1N0cmluZyB8fCBfaXNSZWYpIHtcbiAgICAgIGNvbnN0IGRvU2V0ID0gKCkgPT4ge1xuICAgICAgICBpZiAocmF3UmVmLmYpIHtcbiAgICAgICAgICBjb25zdCBleGlzdGluZyA9IF9pc1N0cmluZyA/IGhhc093bihzZXR1cFN0YXRlLCByZWYpID8gc2V0dXBTdGF0ZVtyZWZdIDogcmVmc1tyZWZdIDogcmVmLnZhbHVlO1xuICAgICAgICAgIGlmIChpc1VubW91bnQpIHtcbiAgICAgICAgICAgIGlzQXJyYXkoZXhpc3RpbmcpICYmIHJlbW92ZShleGlzdGluZywgcmVmVmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkoZXhpc3RpbmcpKSB7XG4gICAgICAgICAgICAgIGlmIChfaXNTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICByZWZzW3JlZl0gPSBbcmVmVmFsdWVdO1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd24oc2V0dXBTdGF0ZSwgcmVmKSkge1xuICAgICAgICAgICAgICAgICAgc2V0dXBTdGF0ZVtyZWZdID0gcmVmc1tyZWZdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWYudmFsdWUgPSBbcmVmVmFsdWVdO1xuICAgICAgICAgICAgICAgIGlmIChyYXdSZWYuaylcbiAgICAgICAgICAgICAgICAgIHJlZnNbcmF3UmVmLmtdID0gcmVmLnZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFleGlzdGluZy5pbmNsdWRlcyhyZWZWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgZXhpc3RpbmcucHVzaChyZWZWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF9pc1N0cmluZykge1xuICAgICAgICAgIHJlZnNbcmVmXSA9IHZhbHVlO1xuICAgICAgICAgIGlmIChoYXNPd24oc2V0dXBTdGF0ZSwgcmVmKSkge1xuICAgICAgICAgICAgc2V0dXBTdGF0ZVtyZWZdID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKF9pc1JlZikge1xuICAgICAgICAgIHJlZi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIGlmIChyYXdSZWYuaylcbiAgICAgICAgICAgIHJlZnNbcmF3UmVmLmtdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHdhcm4oXCJJbnZhbGlkIHRlbXBsYXRlIHJlZiB0eXBlOlwiLCByZWYsIGAoJHt0eXBlb2YgcmVmfSlgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBkb1NldC5pZCA9IC0xO1xuICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoZG9TZXQsIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvU2V0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICB3YXJuKFwiSW52YWxpZCB0ZW1wbGF0ZSByZWYgdHlwZTpcIiwgcmVmLCBgKCR7dHlwZW9mIHJlZn0pYCk7XG4gICAgfVxuICB9XG59XG5cbmxldCBoYXNNaXNtYXRjaCA9IGZhbHNlO1xuY29uc3QgaXNTVkdDb250YWluZXIgPSAoY29udGFpbmVyKSA9PiAvc3ZnLy50ZXN0KGNvbnRhaW5lci5uYW1lc3BhY2VVUkkpICYmIGNvbnRhaW5lci50YWdOYW1lICE9PSBcImZvcmVpZ25PYmplY3RcIjtcbmNvbnN0IGlzQ29tbWVudCA9IChub2RlKSA9PiBub2RlLm5vZGVUeXBlID09PSA4IC8qIENPTU1FTlQgKi87XG5mdW5jdGlvbiBjcmVhdGVIeWRyYXRpb25GdW5jdGlvbnMocmVuZGVyZXJJbnRlcm5hbHMpIHtcbiAgY29uc3Qge1xuICAgIG10OiBtb3VudENvbXBvbmVudCxcbiAgICBwOiBwYXRjaCxcbiAgICBvOiB7XG4gICAgICBwYXRjaFByb3AsXG4gICAgICBjcmVhdGVUZXh0LFxuICAgICAgbmV4dFNpYmxpbmcsXG4gICAgICBwYXJlbnROb2RlLFxuICAgICAgcmVtb3ZlLFxuICAgICAgaW5zZXJ0LFxuICAgICAgY3JlYXRlQ29tbWVudFxuICAgIH1cbiAgfSA9IHJlbmRlcmVySW50ZXJuYWxzO1xuICBjb25zdCBoeWRyYXRlID0gKHZub2RlLCBjb250YWluZXIpID0+IHtcbiAgICBpZiAoIWNvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgICAgYEF0dGVtcHRpbmcgdG8gaHlkcmF0ZSBleGlzdGluZyBtYXJrdXAgYnV0IGNvbnRhaW5lciBpcyBlbXB0eS4gUGVyZm9ybWluZyBmdWxsIG1vdW50IGluc3RlYWQuYFxuICAgICAgKTtcbiAgICAgIHBhdGNoKG51bGwsIHZub2RlLCBjb250YWluZXIpO1xuICAgICAgZmx1c2hQb3N0Rmx1c2hDYnMoKTtcbiAgICAgIGNvbnRhaW5lci5fdm5vZGUgPSB2bm9kZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFzTWlzbWF0Y2ggPSBmYWxzZTtcbiAgICBoeWRyYXRlTm9kZShjb250YWluZXIuZmlyc3RDaGlsZCwgdm5vZGUsIG51bGwsIG51bGwsIG51bGwpO1xuICAgIGZsdXNoUG9zdEZsdXNoQ2JzKCk7XG4gICAgY29udGFpbmVyLl92bm9kZSA9IHZub2RlO1xuICAgIGlmIChoYXNNaXNtYXRjaCAmJiB0cnVlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBIeWRyYXRpb24gY29tcGxldGVkIGJ1dCBjb250YWlucyBtaXNtYXRjaGVzLmApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaHlkcmF0ZU5vZGUgPSAobm9kZSwgdm5vZGUsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCBpc0ZyYWdtZW50U3RhcnQgPSBpc0NvbW1lbnQobm9kZSkgJiYgbm9kZS5kYXRhID09PSBcIltcIjtcbiAgICBjb25zdCBvbk1pc21hdGNoID0gKCkgPT4gaGFuZGxlTWlzbWF0Y2goXG4gICAgICBub2RlLFxuICAgICAgdm5vZGUsXG4gICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgIGlzRnJhZ21lbnRTdGFydFxuICAgICk7XG4gICAgY29uc3QgeyB0eXBlLCByZWYsIHNoYXBlRmxhZywgcGF0Y2hGbGFnIH0gPSB2bm9kZTtcbiAgICBsZXQgZG9tVHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gICAgdm5vZGUuZWwgPSBub2RlO1xuICAgIGlmIChwYXRjaEZsYWcgPT09IC0yKSB7XG4gICAgICBvcHRpbWl6ZWQgPSBmYWxzZTtcbiAgICAgIHZub2RlLmR5bmFtaWNDaGlsZHJlbiA9IG51bGw7XG4gICAgfVxuICAgIGxldCBuZXh0Tm9kZSA9IG51bGw7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFRleHQ6XG4gICAgICAgIGlmIChkb21UeXBlICE9PSAzIC8qIFRFWFQgKi8pIHtcbiAgICAgICAgICBpZiAodm5vZGUuY2hpbGRyZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGluc2VydCh2bm9kZS5lbCA9IGNyZWF0ZVRleHQoXCJcIiksIHBhcmVudE5vZGUobm9kZSksIG5vZGUpO1xuICAgICAgICAgICAgbmV4dE5vZGUgPSBub2RlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0Tm9kZSA9IG9uTWlzbWF0Y2goKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5vZGUuZGF0YSAhPT0gdm5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGhhc01pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgICAgICAgICAgYEh5ZHJhdGlvbiB0ZXh0IG1pc21hdGNoOlxuLSBDbGllbnQ6ICR7SlNPTi5zdHJpbmdpZnkobm9kZS5kYXRhKX1cbi0gU2VydmVyOiAke0pTT04uc3RyaW5naWZ5KHZub2RlLmNoaWxkcmVuKX1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHROb2RlID0gbmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENvbW1lbnQ6XG4gICAgICAgIGlmIChkb21UeXBlICE9PSA4IC8qIENPTU1FTlQgKi8gfHwgaXNGcmFnbWVudFN0YXJ0KSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSBvbk1pc21hdGNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSBuZXh0U2libGluZyhub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU3RhdGljOlxuICAgICAgICBpZiAoaXNGcmFnbWVudFN0YXJ0KSB7XG4gICAgICAgICAgbm9kZSA9IG5leHRTaWJsaW5nKG5vZGUpO1xuICAgICAgICAgIGRvbVR5cGUgPSBub2RlLm5vZGVUeXBlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkb21UeXBlID09PSAxIC8qIEVMRU1FTlQgKi8gfHwgZG9tVHlwZSA9PT0gMyAvKiBURVhUICovKSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSBub2RlO1xuICAgICAgICAgIGNvbnN0IG5lZWRUb0Fkb3B0Q29udGVudCA9ICF2bm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2bm9kZS5zdGF0aWNDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobmVlZFRvQWRvcHRDb250ZW50KVxuICAgICAgICAgICAgICB2bm9kZS5jaGlsZHJlbiArPSBuZXh0Tm9kZS5ub2RlVHlwZSA9PT0gMSAvKiBFTEVNRU5UICovID8gbmV4dE5vZGUub3V0ZXJIVE1MIDogbmV4dE5vZGUuZGF0YTtcbiAgICAgICAgICAgIGlmIChpID09PSB2bm9kZS5zdGF0aWNDb3VudCAtIDEpIHtcbiAgICAgICAgICAgICAgdm5vZGUuYW5jaG9yID0gbmV4dE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0Tm9kZSA9IG5leHRTaWJsaW5nKG5leHROb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGlzRnJhZ21lbnRTdGFydCA/IG5leHRTaWJsaW5nKG5leHROb2RlKSA6IG5leHROb2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uTWlzbWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRnJhZ21lbnQ6XG4gICAgICAgIGlmICghaXNGcmFnbWVudFN0YXJ0KSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSBvbk1pc21hdGNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSBoeWRyYXRlRnJhZ21lbnQoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdm5vZGUsXG4gICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoc2hhcGVGbGFnICYgMSkge1xuICAgICAgICAgIGlmIChkb21UeXBlICE9PSAxIC8qIEVMRU1FTlQgKi8gfHwgdm5vZGUudHlwZS50b0xvd2VyQ2FzZSgpICE9PSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgbmV4dE5vZGUgPSBvbk1pc21hdGNoKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHROb2RlID0gaHlkcmF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIHZub2RlLFxuICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc2hhcGVGbGFnICYgNikge1xuICAgICAgICAgIHZub2RlLnNsb3RTY29wZUlkcyA9IHNsb3RTY29wZUlkcztcbiAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBwYXJlbnROb2RlKG5vZGUpO1xuICAgICAgICAgIG1vdW50Q29tcG9uZW50KFxuICAgICAgICAgICAgdm5vZGUsXG4gICAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgICBpc1NWR0NvbnRhaW5lcihjb250YWluZXIpLFxuICAgICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0Tm9kZSA9IGlzRnJhZ21lbnRTdGFydCA/IGxvY2F0ZUNsb3NpbmdBc3luY0FuY2hvcihub2RlKSA6IG5leHRTaWJsaW5nKG5vZGUpO1xuICAgICAgICAgIGlmIChuZXh0Tm9kZSAmJiBpc0NvbW1lbnQobmV4dE5vZGUpICYmIG5leHROb2RlLmRhdGEgPT09IFwidGVsZXBvcnQgZW5kXCIpIHtcbiAgICAgICAgICAgIG5leHROb2RlID0gbmV4dFNpYmxpbmcobmV4dE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNBc3luY1dyYXBwZXIodm5vZGUpKSB7XG4gICAgICAgICAgICBsZXQgc3ViVHJlZTtcbiAgICAgICAgICAgIGlmIChpc0ZyYWdtZW50U3RhcnQpIHtcbiAgICAgICAgICAgICAgc3ViVHJlZSA9IGNyZWF0ZVZOb2RlKEZyYWdtZW50KTtcbiAgICAgICAgICAgICAgc3ViVHJlZS5hbmNob3IgPSBuZXh0Tm9kZSA/IG5leHROb2RlLnByZXZpb3VzU2libGluZyA6IGNvbnRhaW5lci5sYXN0Q2hpbGQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdWJUcmVlID0gbm9kZS5ub2RlVHlwZSA9PT0gMyA/IGNyZWF0ZVRleHRWTm9kZShcIlwiKSA6IGNyZWF0ZVZOb2RlKFwiZGl2XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ViVHJlZS5lbCA9IG5vZGU7XG4gICAgICAgICAgICB2bm9kZS5jb21wb25lbnQuc3ViVHJlZSA9IHN1YlRyZWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlRmxhZyAmIDY0KSB7XG4gICAgICAgICAgaWYgKGRvbVR5cGUgIT09IDggLyogQ09NTUVOVCAqLykge1xuICAgICAgICAgICAgbmV4dE5vZGUgPSBvbk1pc21hdGNoKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHROb2RlID0gdm5vZGUudHlwZS5oeWRyYXRlKFxuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICB2bm9kZSxcbiAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgICAgICBvcHRpbWl6ZWQsXG4gICAgICAgICAgICAgIHJlbmRlcmVySW50ZXJuYWxzLFxuICAgICAgICAgICAgICBoeWRyYXRlQ2hpbGRyZW5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlRmxhZyAmIDEyOCkge1xuICAgICAgICAgIG5leHROb2RlID0gdm5vZGUudHlwZS5oeWRyYXRlKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIHZub2RlLFxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgICBpc1NWR0NvbnRhaW5lcihwYXJlbnROb2RlKG5vZGUpKSxcbiAgICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICAgIG9wdGltaXplZCxcbiAgICAgICAgICAgIHJlbmRlcmVySW50ZXJuYWxzLFxuICAgICAgICAgICAgaHlkcmF0ZU5vZGVcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB3YXJuKFwiSW52YWxpZCBIb3N0Vk5vZGUgdHlwZTpcIiwgdHlwZSwgYCgke3R5cGVvZiB0eXBlfSlgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVmICE9IG51bGwpIHtcbiAgICAgIHNldFJlZihyZWYsIG51bGwsIHBhcmVudFN1c3BlbnNlLCB2bm9kZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXh0Tm9kZTtcbiAgfTtcbiAgY29uc3QgaHlkcmF0ZUVsZW1lbnQgPSAoZWwsIHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCkgPT4ge1xuICAgIG9wdGltaXplZCA9IG9wdGltaXplZCB8fCAhIXZub2RlLmR5bmFtaWNDaGlsZHJlbjtcbiAgICBjb25zdCB7IHR5cGUsIHByb3BzLCBwYXRjaEZsYWcsIHNoYXBlRmxhZywgZGlycyB9ID0gdm5vZGU7XG4gICAgY29uc3QgZm9yY2VQYXRjaFZhbHVlID0gdHlwZSA9PT0gXCJpbnB1dFwiICYmIGRpcnMgfHwgdHlwZSA9PT0gXCJvcHRpb25cIjtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB8fCBmb3JjZVBhdGNoVmFsdWUgfHwgcGF0Y2hGbGFnICE9PSAtMSkge1xuICAgICAgaWYgKGRpcnMpIHtcbiAgICAgICAgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBcImNyZWF0ZWRcIik7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgaWYgKGZvcmNlUGF0Y2hWYWx1ZSB8fCAhb3B0aW1pemVkIHx8IHBhdGNoRmxhZyAmICgxNiB8IDMyKSkge1xuICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAoZm9yY2VQYXRjaFZhbHVlICYmIGtleS5lbmRzV2l0aChcInZhbHVlXCIpIHx8IGlzT24oa2V5KSAmJiAhaXNSZXNlcnZlZFByb3Aoa2V5KSkge1xuICAgICAgICAgICAgICBwYXRjaFByb3AoXG4gICAgICAgICAgICAgICAgZWwsXG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgcHJvcHNba2V5XSxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICB2b2lkIDAsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLm9uQ2xpY2spIHtcbiAgICAgICAgICBwYXRjaFByb3AoXG4gICAgICAgICAgICBlbCxcbiAgICAgICAgICAgIFwib25DbGlja1wiLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHByb3BzLm9uQ2xpY2ssXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHZvaWQgMCxcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCB2bm9kZUhvb2tzO1xuICAgICAgaWYgKHZub2RlSG9va3MgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlQmVmb3JlTW91bnQpIHtcbiAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9va3MsIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGRpcnMpIHtcbiAgICAgICAgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBcImJlZm9yZU1vdW50XCIpO1xuICAgICAgfVxuICAgICAgaWYgKCh2bm9kZUhvb2tzID0gcHJvcHMgJiYgcHJvcHMub25Wbm9kZU1vdW50ZWQpIHx8IGRpcnMpIHtcbiAgICAgICAgcXVldWVFZmZlY3RXaXRoU3VzcGVuc2UoKCkgPT4ge1xuICAgICAgICAgIHZub2RlSG9va3MgJiYgaW52b2tlVk5vZGVIb29rKHZub2RlSG9va3MsIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xuICAgICAgICAgIGRpcnMgJiYgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBcIm1vdW50ZWRcIik7XG4gICAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIH1cbiAgICAgIGlmIChzaGFwZUZsYWcgJiAxNiAmJiAvLyBza2lwIGlmIGVsZW1lbnQgaGFzIGlubmVySFRNTCAvIHRleHRDb250ZW50XG4gICAgICAhKHByb3BzICYmIChwcm9wcy5pbm5lckhUTUwgfHwgcHJvcHMudGV4dENvbnRlbnQpKSkge1xuICAgICAgICBsZXQgbmV4dCA9IGh5ZHJhdGVDaGlsZHJlbihcbiAgICAgICAgICBlbC5maXJzdENoaWxkLFxuICAgICAgICAgIHZub2RlLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICAgIGxldCBoYXNXYXJuZWQgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKG5leHQpIHtcbiAgICAgICAgICBoYXNNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgIWhhc1dhcm5lZCkge1xuICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgYEh5ZHJhdGlvbiBjaGlsZHJlbiBtaXNtYXRjaCBpbiA8JHt2bm9kZS50eXBlfT46IHNlcnZlciByZW5kZXJlZCBlbGVtZW50IGNvbnRhaW5zIG1vcmUgY2hpbGQgbm9kZXMgdGhhbiBjbGllbnQgdmRvbS5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaGFzV2FybmVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgY3VyID0gbmV4dDtcbiAgICAgICAgICBuZXh0ID0gbmV4dC5uZXh0U2libGluZztcbiAgICAgICAgICByZW1vdmUoY3VyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzaGFwZUZsYWcgJiA4KSB7XG4gICAgICAgIGlmIChlbC50ZXh0Q29udGVudCAhPT0gdm5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICBoYXNNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB3YXJuKFxuICAgICAgICAgICAgYEh5ZHJhdGlvbiB0ZXh0IGNvbnRlbnQgbWlzbWF0Y2ggaW4gPCR7dm5vZGUudHlwZX0+OlxuLSBDbGllbnQ6ICR7ZWwudGV4dENvbnRlbnR9XG4tIFNlcnZlcjogJHt2bm9kZS5jaGlsZHJlbn1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlbC50ZXh0Q29udGVudCA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbC5uZXh0U2libGluZztcbiAgfTtcbiAgY29uc3QgaHlkcmF0ZUNoaWxkcmVuID0gKG5vZGUsIHBhcmVudFZOb2RlLCBjb250YWluZXIsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgb3B0aW1pemVkID0gb3B0aW1pemVkIHx8ICEhcGFyZW50Vk5vZGUuZHluYW1pY0NoaWxkcmVuO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50Vk5vZGUuY2hpbGRyZW47XG4gICAgY29uc3QgbCA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICBsZXQgaGFzV2FybmVkID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IHZub2RlID0gb3B0aW1pemVkID8gY2hpbGRyZW5baV0gOiBjaGlsZHJlbltpXSA9IG5vcm1hbGl6ZVZOb2RlKGNoaWxkcmVuW2ldKTtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIG5vZGUgPSBoeWRyYXRlTm9kZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHZub2RlLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHZub2RlLnR5cGUgPT09IFRleHQgJiYgIXZub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaGFzV2FybmVkKSB7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIGBIeWRyYXRpb24gY2hpbGRyZW4gbWlzbWF0Y2ggaW4gPCR7Y29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+OiBzZXJ2ZXIgcmVuZGVyZWQgZWxlbWVudCBjb250YWlucyBmZXdlciBjaGlsZCBub2RlcyB0aGFuIGNsaWVudCB2ZG9tLmBcbiAgICAgICAgICApO1xuICAgICAgICAgIGhhc1dhcm5lZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGF0Y2goXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB2bm9kZSxcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkdDb250YWluZXIoY29udGFpbmVyKSxcbiAgICAgICAgICBzbG90U2NvcGVJZHNcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG4gIGNvbnN0IGh5ZHJhdGVGcmFnbWVudCA9IChub2RlLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgc2xvdFNjb3BlSWRzLCBvcHRpbWl6ZWQpID0+IHtcbiAgICBjb25zdCB7IHNsb3RTY29wZUlkczogZnJhZ21lbnRTbG90U2NvcGVJZHMgfSA9IHZub2RlO1xuICAgIGlmIChmcmFnbWVudFNsb3RTY29wZUlkcykge1xuICAgICAgc2xvdFNjb3BlSWRzID0gc2xvdFNjb3BlSWRzID8gc2xvdFNjb3BlSWRzLmNvbmNhdChmcmFnbWVudFNsb3RTY29wZUlkcykgOiBmcmFnbWVudFNsb3RTY29wZUlkcztcbiAgICB9XG4gICAgY29uc3QgY29udGFpbmVyID0gcGFyZW50Tm9kZShub2RlKTtcbiAgICBjb25zdCBuZXh0ID0gaHlkcmF0ZUNoaWxkcmVuKFxuICAgICAgbmV4dFNpYmxpbmcobm9kZSksXG4gICAgICB2bm9kZSxcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgb3B0aW1pemVkXG4gICAgKTtcbiAgICBpZiAobmV4dCAmJiBpc0NvbW1lbnQobmV4dCkgJiYgbmV4dC5kYXRhID09PSBcIl1cIikge1xuICAgICAgcmV0dXJuIG5leHRTaWJsaW5nKHZub2RlLmFuY2hvciA9IG5leHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYXNNaXNtYXRjaCA9IHRydWU7XG4gICAgICBpbnNlcnQodm5vZGUuYW5jaG9yID0gY3JlYXRlQ29tbWVudChgXWApLCBjb250YWluZXIsIG5leHQpO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICB9O1xuICBjb25zdCBoYW5kbGVNaXNtYXRjaCA9IChub2RlLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgc2xvdFNjb3BlSWRzLCBpc0ZyYWdtZW50KSA9PiB7XG4gICAgaGFzTWlzbWF0Y2ggPSB0cnVlO1xuICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgIGBIeWRyYXRpb24gbm9kZSBtaXNtYXRjaDpcbi0gQ2xpZW50IHZub2RlOmAsXG4gICAgICB2bm9kZS50eXBlLFxuICAgICAgYFxuLSBTZXJ2ZXIgcmVuZGVyZWQgRE9NOmAsXG4gICAgICBub2RlLFxuICAgICAgbm9kZS5ub2RlVHlwZSA9PT0gMyAvKiBURVhUICovID8gYCh0ZXh0KWAgOiBpc0NvbW1lbnQobm9kZSkgJiYgbm9kZS5kYXRhID09PSBcIltcIiA/IGAoc3RhcnQgb2YgZnJhZ21lbnQpYCA6IGBgXG4gICAgKTtcbiAgICB2bm9kZS5lbCA9IG51bGw7XG4gICAgaWYgKGlzRnJhZ21lbnQpIHtcbiAgICAgIGNvbnN0IGVuZCA9IGxvY2F0ZUNsb3NpbmdBc3luY0FuY2hvcihub2RlKTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5leHQyID0gbmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICAgIGlmIChuZXh0MiAmJiBuZXh0MiAhPT0gZW5kKSB7XG4gICAgICAgICAgcmVtb3ZlKG5leHQyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBuZXh0ID0gbmV4dFNpYmxpbmcobm9kZSk7XG4gICAgY29uc3QgY29udGFpbmVyID0gcGFyZW50Tm9kZShub2RlKTtcbiAgICByZW1vdmUobm9kZSk7XG4gICAgcGF0Y2goXG4gICAgICBudWxsLFxuICAgICAgdm5vZGUsXG4gICAgICBjb250YWluZXIsXG4gICAgICBuZXh0LFxuICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICBpc1NWR0NvbnRhaW5lcihjb250YWluZXIpLFxuICAgICAgc2xvdFNjb3BlSWRzXG4gICAgKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfTtcbiAgY29uc3QgbG9jYXRlQ2xvc2luZ0FzeW5jQW5jaG9yID0gKG5vZGUpID0+IHtcbiAgICBsZXQgbWF0Y2ggPSAwO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBub2RlID0gbmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICBpZiAobm9kZSAmJiBpc0NvbW1lbnQobm9kZSkpIHtcbiAgICAgICAgaWYgKG5vZGUuZGF0YSA9PT0gXCJbXCIpXG4gICAgICAgICAgbWF0Y2grKztcbiAgICAgICAgaWYgKG5vZGUuZGF0YSA9PT0gXCJdXCIpIHtcbiAgICAgICAgICBpZiAobWF0Y2ggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0U2libGluZyhub2RlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWF0Y2gtLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH07XG4gIHJldHVybiBbaHlkcmF0ZSwgaHlkcmF0ZU5vZGVdO1xufVxuXG5sZXQgc3VwcG9ydGVkO1xubGV0IHBlcmY7XG5mdW5jdGlvbiBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIHR5cGUpIHtcbiAgaWYgKGluc3RhbmNlLmFwcENvbnRleHQuY29uZmlnLnBlcmZvcm1hbmNlICYmIGlzU3VwcG9ydGVkKCkpIHtcbiAgICBwZXJmLm1hcmsoYHZ1ZS0ke3R5cGV9LSR7aW5zdGFuY2UudWlkfWApO1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgIGRldnRvb2xzUGVyZlN0YXJ0KGluc3RhbmNlLCB0eXBlLCBpc1N1cHBvcnRlZCgpID8gcGVyZi5ub3coKSA6IERhdGUubm93KCkpO1xuICB9XG59XG5mdW5jdGlvbiBlbmRNZWFzdXJlKGluc3RhbmNlLCB0eXBlKSB7XG4gIGlmIChpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZy5wZXJmb3JtYW5jZSAmJiBpc1N1cHBvcnRlZCgpKSB7XG4gICAgY29uc3Qgc3RhcnRUYWcgPSBgdnVlLSR7dHlwZX0tJHtpbnN0YW5jZS51aWR9YDtcbiAgICBjb25zdCBlbmRUYWcgPSBzdGFydFRhZyArIGA6ZW5kYDtcbiAgICBwZXJmLm1hcmsoZW5kVGFnKTtcbiAgICBwZXJmLm1lYXN1cmUoXG4gICAgICBgPCR7Zm9ybWF0Q29tcG9uZW50TmFtZShpbnN0YW5jZSwgaW5zdGFuY2UudHlwZSl9PiAke3R5cGV9YCxcbiAgICAgIHN0YXJ0VGFnLFxuICAgICAgZW5kVGFnXG4gICAgKTtcbiAgICBwZXJmLmNsZWFyTWFya3Moc3RhcnRUYWcpO1xuICAgIHBlcmYuY2xlYXJNYXJrcyhlbmRUYWcpO1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgIGRldnRvb2xzUGVyZkVuZChpbnN0YW5jZSwgdHlwZSwgaXNTdXBwb3J0ZWQoKSA/IHBlcmYubm93KCkgOiBEYXRlLm5vdygpKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIGlmIChzdXBwb3J0ZWQgIT09IHZvaWQgMCkge1xuICAgIHJldHVybiBzdXBwb3J0ZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LnBlcmZvcm1hbmNlKSB7XG4gICAgc3VwcG9ydGVkID0gdHJ1ZTtcbiAgICBwZXJmID0gd2luZG93LnBlcmZvcm1hbmNlO1xuICB9IGVsc2Uge1xuICAgIHN1cHBvcnRlZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiBzdXBwb3J0ZWQ7XG59XG5cbmZ1bmN0aW9uIGluaXRGZWF0dXJlRmxhZ3MoKSB7XG4gIGNvbnN0IG5lZWRXYXJuID0gW107XG4gIGlmICh0eXBlb2YgX19WVUVfT1BUSU9OU19BUElfXyAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIG5lZWRXYXJuLnB1c2goYF9fVlVFX09QVElPTlNfQVBJX19gKTtcbiAgICBnZXRHbG9iYWxUaGlzKCkuX19WVUVfT1BUSU9OU19BUElfXyA9IHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBfX1ZVRV9QUk9EX0RFVlRPT0xTX18gIT09IFwiYm9vbGVhblwiKSB7XG4gICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBuZWVkV2Fybi5wdXNoKGBfX1ZVRV9QUk9EX0RFVlRPT0xTX19gKTtcbiAgICBnZXRHbG9iYWxUaGlzKCkuX19WVUVfUFJPRF9ERVZUT09MU19fID0gZmFsc2U7XG4gIH1cbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgbmVlZFdhcm4ubGVuZ3RoKSB7XG4gICAgY29uc3QgbXVsdGkgPSBuZWVkV2Fybi5sZW5ndGggPiAxO1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgIGBGZWF0dXJlIGZsYWcke211bHRpID8gYHNgIDogYGB9ICR7bmVlZFdhcm4uam9pbihcIiwgXCIpfSAke211bHRpID8gYGFyZWAgOiBgaXNgfSBub3QgZXhwbGljaXRseSBkZWZpbmVkLiBZb3UgYXJlIHJ1bm5pbmcgdGhlIGVzbS1idW5kbGVyIGJ1aWxkIG9mIFZ1ZSwgd2hpY2ggZXhwZWN0cyB0aGVzZSBjb21waWxlLXRpbWUgZmVhdHVyZSBmbGFncyB0byBiZSBnbG9iYWxseSBpbmplY3RlZCB2aWEgdGhlIGJ1bmRsZXIgY29uZmlnIGluIG9yZGVyIHRvIGdldCBiZXR0ZXIgdHJlZS1zaGFraW5nIGluIHRoZSBwcm9kdWN0aW9uIGJ1bmRsZS5cblxuRm9yIG1vcmUgZGV0YWlscywgc2VlIGh0dHBzOi8vbGluay52dWVqcy5vcmcvZmVhdHVyZS1mbGFncy5gXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QgPSBxdWV1ZUVmZmVjdFdpdGhTdXNwZW5zZSA7XG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJlcihvcHRpb25zKSB7XG4gIHJldHVybiBiYXNlQ3JlYXRlUmVuZGVyZXIob3B0aW9ucyk7XG59XG5mdW5jdGlvbiBjcmVhdGVIeWRyYXRpb25SZW5kZXJlcihvcHRpb25zKSB7XG4gIHJldHVybiBiYXNlQ3JlYXRlUmVuZGVyZXIob3B0aW9ucywgY3JlYXRlSHlkcmF0aW9uRnVuY3Rpb25zKTtcbn1cbmZ1bmN0aW9uIGJhc2VDcmVhdGVSZW5kZXJlcihvcHRpb25zLCBjcmVhdGVIeWRyYXRpb25GbnMpIHtcbiAge1xuICAgIGluaXRGZWF0dXJlRmxhZ3MoKTtcbiAgfVxuICBjb25zdCB0YXJnZXQgPSBnZXRHbG9iYWxUaGlzKCk7XG4gIHRhcmdldC5fX1ZVRV9fID0gdHJ1ZTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSB7XG4gICAgc2V0RGV2dG9vbHNIb29rKHRhcmdldC5fX1ZVRV9ERVZUT09MU19HTE9CQUxfSE9PS19fLCB0YXJnZXQpO1xuICB9XG4gIGNvbnN0IHtcbiAgICBpbnNlcnQ6IGhvc3RJbnNlcnQsXG4gICAgcmVtb3ZlOiBob3N0UmVtb3ZlLFxuICAgIHBhdGNoUHJvcDogaG9zdFBhdGNoUHJvcCxcbiAgICBjcmVhdGVFbGVtZW50OiBob3N0Q3JlYXRlRWxlbWVudCxcbiAgICBjcmVhdGVUZXh0OiBob3N0Q3JlYXRlVGV4dCxcbiAgICBjcmVhdGVDb21tZW50OiBob3N0Q3JlYXRlQ29tbWVudCxcbiAgICBzZXRUZXh0OiBob3N0U2V0VGV4dCxcbiAgICBzZXRFbGVtZW50VGV4dDogaG9zdFNldEVsZW1lbnRUZXh0LFxuICAgIHBhcmVudE5vZGU6IGhvc3RQYXJlbnROb2RlLFxuICAgIG5leHRTaWJsaW5nOiBob3N0TmV4dFNpYmxpbmcsXG4gICAgc2V0U2NvcGVJZDogaG9zdFNldFNjb3BlSWQgPSBOT09QLFxuICAgIGluc2VydFN0YXRpY0NvbnRlbnQ6IGhvc3RJbnNlcnRTdGF0aWNDb250ZW50XG4gIH0gPSBvcHRpb25zO1xuICBjb25zdCBwYXRjaCA9IChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yID0gbnVsbCwgcGFyZW50Q29tcG9uZW50ID0gbnVsbCwgcGFyZW50U3VzcGVuc2UgPSBudWxsLCBpc1NWRyA9IGZhbHNlLCBzbG90U2NvcGVJZHMgPSBudWxsLCBvcHRpbWl6ZWQgPSAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGlzSG1yVXBkYXRpbmcgPyBmYWxzZSA6ICEhbjIuZHluYW1pY0NoaWxkcmVuKSA9PiB7XG4gICAgaWYgKG4xID09PSBuMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobjEgJiYgIWlzU2FtZVZOb2RlVHlwZShuMSwgbjIpKSB7XG4gICAgICBhbmNob3IgPSBnZXROZXh0SG9zdE5vZGUobjEpO1xuICAgICAgdW5tb3VudChuMSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdHJ1ZSk7XG4gICAgICBuMSA9IG51bGw7XG4gICAgfVxuICAgIGlmIChuMi5wYXRjaEZsYWcgPT09IC0yKSB7XG4gICAgICBvcHRpbWl6ZWQgPSBmYWxzZTtcbiAgICAgIG4yLmR5bmFtaWNDaGlsZHJlbiA9IG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgdHlwZSwgcmVmLCBzaGFwZUZsYWcgfSA9IG4yO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBUZXh0OlxuICAgICAgICBwcm9jZXNzVGV4dChuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENvbW1lbnQ6XG4gICAgICAgIHByb2Nlc3NDb21tZW50Tm9kZShuMSwgbjIsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFN0YXRpYzpcbiAgICAgICAgaWYgKG4xID09IG51bGwpIHtcbiAgICAgICAgICBtb3VudFN0YXRpY05vZGUobjIsIGNvbnRhaW5lciwgYW5jaG9yLCBpc1NWRyk7XG4gICAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHBhdGNoU3RhdGljTm9kZShuMSwgbjIsIGNvbnRhaW5lciwgaXNTVkcpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBGcmFnbWVudDpcbiAgICAgICAgcHJvY2Vzc0ZyYWdtZW50KFxuICAgICAgICAgIG4xLFxuICAgICAgICAgIG4yLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoc2hhcGVGbGFnICYgMSkge1xuICAgICAgICAgIHByb2Nlc3NFbGVtZW50KFxuICAgICAgICAgICAgbjEsXG4gICAgICAgICAgICBuMixcbiAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlRmxhZyAmIDYpIHtcbiAgICAgICAgICBwcm9jZXNzQ29tcG9uZW50KFxuICAgICAgICAgICAgbjEsXG4gICAgICAgICAgICBuMixcbiAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlRmxhZyAmIDY0KSB7XG4gICAgICAgICAgdHlwZS5wcm9jZXNzKFxuICAgICAgICAgICAgbjEsXG4gICAgICAgICAgICBuMixcbiAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWQsXG4gICAgICAgICAgICBpbnRlcm5hbHNcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHNoYXBlRmxhZyAmIDEyOCkge1xuICAgICAgICAgIHR5cGUucHJvY2VzcyhcbiAgICAgICAgICAgIG4xLFxuICAgICAgICAgICAgbjIsXG4gICAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgICAgb3B0aW1pemVkLFxuICAgICAgICAgICAgaW50ZXJuYWxzXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgd2FybihcIkludmFsaWQgVk5vZGUgdHlwZTpcIiwgdHlwZSwgYCgke3R5cGVvZiB0eXBlfSlgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVmICE9IG51bGwgJiYgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgICBzZXRSZWYocmVmLCBuMSAmJiBuMS5yZWYsIHBhcmVudFN1c3BlbnNlLCBuMiB8fCBuMSwgIW4yKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHByb2Nlc3NUZXh0ID0gKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IpID0+IHtcbiAgICBpZiAobjEgPT0gbnVsbCkge1xuICAgICAgaG9zdEluc2VydChcbiAgICAgICAgbjIuZWwgPSBob3N0Q3JlYXRlVGV4dChuMi5jaGlsZHJlbiksXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgYW5jaG9yXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlbCA9IG4yLmVsID0gbjEuZWw7XG4gICAgICBpZiAobjIuY2hpbGRyZW4gIT09IG4xLmNoaWxkcmVuKSB7XG4gICAgICAgIGhvc3RTZXRUZXh0KGVsLCBuMi5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBwcm9jZXNzQ29tbWVudE5vZGUgPSAobjEsIG4yLCBjb250YWluZXIsIGFuY2hvcikgPT4ge1xuICAgIGlmIChuMSA9PSBudWxsKSB7XG4gICAgICBob3N0SW5zZXJ0KFxuICAgICAgICBuMi5lbCA9IGhvc3RDcmVhdGVDb21tZW50KG4yLmNoaWxkcmVuIHx8IFwiXCIpLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvclxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbjIuZWwgPSBuMS5lbDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1vdW50U3RhdGljTm9kZSA9IChuMiwgY29udGFpbmVyLCBhbmNob3IsIGlzU1ZHKSA9PiB7XG4gICAgW24yLmVsLCBuMi5hbmNob3JdID0gaG9zdEluc2VydFN0YXRpY0NvbnRlbnQoXG4gICAgICBuMi5jaGlsZHJlbixcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGFuY2hvcixcbiAgICAgIGlzU1ZHLFxuICAgICAgbjIuZWwsXG4gICAgICBuMi5hbmNob3JcbiAgICApO1xuICB9O1xuICBjb25zdCBwYXRjaFN0YXRpY05vZGUgPSAobjEsIG4yLCBjb250YWluZXIsIGlzU1ZHKSA9PiB7XG4gICAgaWYgKG4yLmNoaWxkcmVuICE9PSBuMS5jaGlsZHJlbikge1xuICAgICAgY29uc3QgYW5jaG9yID0gaG9zdE5leHRTaWJsaW5nKG4xLmFuY2hvcik7XG4gICAgICByZW1vdmVTdGF0aWNOb2RlKG4xKTtcbiAgICAgIFtuMi5lbCwgbjIuYW5jaG9yXSA9IGhvc3RJbnNlcnRTdGF0aWNDb250ZW50KFxuICAgICAgICBuMi5jaGlsZHJlbixcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBhbmNob3IsXG4gICAgICAgIGlzU1ZHXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBuMi5lbCA9IG4xLmVsO1xuICAgICAgbjIuYW5jaG9yID0gbjEuYW5jaG9yO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbW92ZVN0YXRpY05vZGUgPSAoeyBlbCwgYW5jaG9yIH0sIGNvbnRhaW5lciwgbmV4dFNpYmxpbmcpID0+IHtcbiAgICBsZXQgbmV4dDtcbiAgICB3aGlsZSAoZWwgJiYgZWwgIT09IGFuY2hvcikge1xuICAgICAgbmV4dCA9IGhvc3ROZXh0U2libGluZyhlbCk7XG4gICAgICBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIG5leHRTaWJsaW5nKTtcbiAgICAgIGVsID0gbmV4dDtcbiAgICB9XG4gICAgaG9zdEluc2VydChhbmNob3IsIGNvbnRhaW5lciwgbmV4dFNpYmxpbmcpO1xuICB9O1xuICBjb25zdCByZW1vdmVTdGF0aWNOb2RlID0gKHsgZWwsIGFuY2hvciB9KSA9PiB7XG4gICAgbGV0IG5leHQ7XG4gICAgd2hpbGUgKGVsICYmIGVsICE9PSBhbmNob3IpIHtcbiAgICAgIG5leHQgPSBob3N0TmV4dFNpYmxpbmcoZWwpO1xuICAgICAgaG9zdFJlbW92ZShlbCk7XG4gICAgICBlbCA9IG5leHQ7XG4gICAgfVxuICAgIGhvc3RSZW1vdmUoYW5jaG9yKTtcbiAgfTtcbiAgY29uc3QgcHJvY2Vzc0VsZW1lbnQgPSAobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgaXNTVkcgPSBpc1NWRyB8fCBuMi50eXBlID09PSBcInN2Z1wiO1xuICAgIGlmIChuMSA9PSBudWxsKSB7XG4gICAgICBtb3VudEVsZW1lbnQoXG4gICAgICAgIG4yLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRjaEVsZW1lbnQoXG4gICAgICAgIG4xLFxuICAgICAgICBuMixcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbW91bnRFbGVtZW50ID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgbGV0IGVsO1xuICAgIGxldCB2bm9kZUhvb2s7XG4gICAgY29uc3QgeyB0eXBlLCBwcm9wcywgc2hhcGVGbGFnLCB0cmFuc2l0aW9uLCBkaXJzIH0gPSB2bm9kZTtcbiAgICBlbCA9IHZub2RlLmVsID0gaG9zdENyZWF0ZUVsZW1lbnQoXG4gICAgICB2bm9kZS50eXBlLFxuICAgICAgaXNTVkcsXG4gICAgICBwcm9wcyAmJiBwcm9wcy5pcyxcbiAgICAgIHByb3BzXG4gICAgKTtcbiAgICBpZiAoc2hhcGVGbGFnICYgOCkge1xuICAgICAgaG9zdFNldEVsZW1lbnRUZXh0KGVsLCB2bm9kZS5jaGlsZHJlbik7XG4gICAgfSBlbHNlIGlmIChzaGFwZUZsYWcgJiAxNikge1xuICAgICAgbW91bnRDaGlsZHJlbihcbiAgICAgICAgdm5vZGUuY2hpbGRyZW4sXG4gICAgICAgIGVsLFxuICAgICAgICBudWxsLFxuICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICBpc1NWRyAmJiB0eXBlICE9PSBcImZvcmVpZ25PYmplY3RcIixcbiAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChkaXJzKSB7XG4gICAgICBpbnZva2VEaXJlY3RpdmVIb29rKHZub2RlLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIFwiY3JlYXRlZFwiKTtcbiAgICB9XG4gICAgc2V0U2NvcGVJZChlbCwgdm5vZGUsIHZub2RlLnNjb3BlSWQsIHNsb3RTY29wZUlkcywgcGFyZW50Q29tcG9uZW50KTtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICAgIGlmIChrZXkgIT09IFwidmFsdWVcIiAmJiAhaXNSZXNlcnZlZFByb3Aoa2V5KSkge1xuICAgICAgICAgIGhvc3RQYXRjaFByb3AoXG4gICAgICAgICAgICBlbCxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBwcm9wc1trZXldLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICB2bm9kZS5jaGlsZHJlbixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgdW5tb3VudENoaWxkcmVuXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBwcm9wcykge1xuICAgICAgICBob3N0UGF0Y2hQcm9wKGVsLCBcInZhbHVlXCIsIG51bGwsIHByb3BzLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIGlmICh2bm9kZUhvb2sgPSBwcm9wcy5vblZub2RlQmVmb3JlTW91bnQpIHtcbiAgICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCB2bm9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBcIl9fdm5vZGVcIiwge1xuICAgICAgICB2YWx1ZTogdm5vZGUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwgXCJfX3Z1ZVBhcmVudENvbXBvbmVudFwiLCB7XG4gICAgICAgIHZhbHVlOiBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGRpcnMpIHtcbiAgICAgIGludm9rZURpcmVjdGl2ZUhvb2sodm5vZGUsIG51bGwsIHBhcmVudENvbXBvbmVudCwgXCJiZWZvcmVNb3VudFwiKTtcbiAgICB9XG4gICAgY29uc3QgbmVlZENhbGxUcmFuc2l0aW9uSG9va3MgPSAoIXBhcmVudFN1c3BlbnNlIHx8IHBhcmVudFN1c3BlbnNlICYmICFwYXJlbnRTdXNwZW5zZS5wZW5kaW5nQnJhbmNoKSAmJiB0cmFuc2l0aW9uICYmICF0cmFuc2l0aW9uLnBlcnNpc3RlZDtcbiAgICBpZiAobmVlZENhbGxUcmFuc2l0aW9uSG9va3MpIHtcbiAgICAgIHRyYW5zaXRpb24uYmVmb3JlRW50ZXIoZWwpO1xuICAgIH1cbiAgICBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIGFuY2hvcik7XG4gICAgaWYgKCh2bm9kZUhvb2sgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlTW91bnRlZCkgfHwgbmVlZENhbGxUcmFuc2l0aW9uSG9va3MgfHwgZGlycykge1xuICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdm5vZGVIb29rICYmIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudENvbXBvbmVudCwgdm5vZGUpO1xuICAgICAgICBuZWVkQ2FsbFRyYW5zaXRpb25Ib29rcyAmJiB0cmFuc2l0aW9uLmVudGVyKGVsKTtcbiAgICAgICAgZGlycyAmJiBpbnZva2VEaXJlY3RpdmVIb29rKHZub2RlLCBudWxsLCBwYXJlbnRDb21wb25lbnQsIFwibW91bnRlZFwiKTtcbiAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldFNjb3BlSWQgPSAoZWwsIHZub2RlLCBzY29wZUlkLCBzbG90U2NvcGVJZHMsIHBhcmVudENvbXBvbmVudCkgPT4ge1xuICAgIGlmIChzY29wZUlkKSB7XG4gICAgICBob3N0U2V0U2NvcGVJZChlbCwgc2NvcGVJZCk7XG4gICAgfVxuICAgIGlmIChzbG90U2NvcGVJZHMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xvdFNjb3BlSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhvc3RTZXRTY29wZUlkKGVsLCBzbG90U2NvcGVJZHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFyZW50Q29tcG9uZW50KSB7XG4gICAgICBsZXQgc3ViVHJlZSA9IHBhcmVudENvbXBvbmVudC5zdWJUcmVlO1xuICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgc3ViVHJlZS5wYXRjaEZsYWcgPiAwICYmIHN1YlRyZWUucGF0Y2hGbGFnICYgMjA0OCkge1xuICAgICAgICBzdWJUcmVlID0gZmlsdGVyU2luZ2xlUm9vdChzdWJUcmVlLmNoaWxkcmVuKSB8fCBzdWJUcmVlO1xuICAgICAgfVxuICAgICAgaWYgKHZub2RlID09PSBzdWJUcmVlKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudFZOb2RlID0gcGFyZW50Q29tcG9uZW50LnZub2RlO1xuICAgICAgICBzZXRTY29wZUlkKFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHBhcmVudFZOb2RlLFxuICAgICAgICAgIHBhcmVudFZOb2RlLnNjb3BlSWQsXG4gICAgICAgICAgcGFyZW50Vk5vZGUuc2xvdFNjb3BlSWRzLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudC5wYXJlbnRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IG1vdW50Q2hpbGRyZW4gPSAoY2hpbGRyZW4sIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgc2xvdFNjb3BlSWRzLCBvcHRpbWl6ZWQsIHN0YXJ0ID0gMCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldID0gb3B0aW1pemVkID8gY2xvbmVJZk1vdW50ZWQoY2hpbGRyZW5baV0pIDogbm9ybWFsaXplVk5vZGUoY2hpbGRyZW5baV0pO1xuICAgICAgcGF0Y2goXG4gICAgICAgIG51bGwsXG4gICAgICAgIGNoaWxkLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcGF0Y2hFbGVtZW50ID0gKG4xLCBuMiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgY29uc3QgZWwgPSBuMi5lbCA9IG4xLmVsO1xuICAgIGxldCB7IHBhdGNoRmxhZywgZHluYW1pY0NoaWxkcmVuLCBkaXJzIH0gPSBuMjtcbiAgICBwYXRjaEZsYWcgfD0gbjEucGF0Y2hGbGFnICYgMTY7XG4gICAgY29uc3Qgb2xkUHJvcHMgPSBuMS5wcm9wcyB8fCBFTVBUWV9PQko7XG4gICAgY29uc3QgbmV3UHJvcHMgPSBuMi5wcm9wcyB8fCBFTVBUWV9PQko7XG4gICAgbGV0IHZub2RlSG9vaztcbiAgICBwYXJlbnRDb21wb25lbnQgJiYgdG9nZ2xlUmVjdXJzZShwYXJlbnRDb21wb25lbnQsIGZhbHNlKTtcbiAgICBpZiAodm5vZGVIb29rID0gbmV3UHJvcHMub25Wbm9kZUJlZm9yZVVwZGF0ZSkge1xuICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCBuMiwgbjEpO1xuICAgIH1cbiAgICBpZiAoZGlycykge1xuICAgICAgaW52b2tlRGlyZWN0aXZlSG9vayhuMiwgbjEsIHBhcmVudENvbXBvbmVudCwgXCJiZWZvcmVVcGRhdGVcIik7XG4gICAgfVxuICAgIHBhcmVudENvbXBvbmVudCAmJiB0b2dnbGVSZWN1cnNlKHBhcmVudENvbXBvbmVudCwgdHJ1ZSk7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgaXNIbXJVcGRhdGluZykge1xuICAgICAgcGF0Y2hGbGFnID0gMDtcbiAgICAgIG9wdGltaXplZCA9IGZhbHNlO1xuICAgICAgZHluYW1pY0NoaWxkcmVuID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYXJlQ2hpbGRyZW5TVkcgPSBpc1NWRyAmJiBuMi50eXBlICE9PSBcImZvcmVpZ25PYmplY3RcIjtcbiAgICBpZiAoZHluYW1pY0NoaWxkcmVuKSB7XG4gICAgICBwYXRjaEJsb2NrQ2hpbGRyZW4oXG4gICAgICAgIG4xLmR5bmFtaWNDaGlsZHJlbixcbiAgICAgICAgZHluYW1pY0NoaWxkcmVuLFxuICAgICAgICBlbCxcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgYXJlQ2hpbGRyZW5TVkcsXG4gICAgICAgIHNsb3RTY29wZUlkc1xuICAgICAgKTtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIHRyYXZlcnNlU3RhdGljQ2hpbGRyZW4objEsIG4yKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFvcHRpbWl6ZWQpIHtcbiAgICAgIHBhdGNoQ2hpbGRyZW4oXG4gICAgICAgIG4xLFxuICAgICAgICBuMixcbiAgICAgICAgZWwsXG4gICAgICAgIG51bGwsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgIGFyZUNoaWxkcmVuU1ZHLFxuICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAocGF0Y2hGbGFnID4gMCkge1xuICAgICAgaWYgKHBhdGNoRmxhZyAmIDE2KSB7XG4gICAgICAgIHBhdGNoUHJvcHMoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgbjIsXG4gICAgICAgICAgb2xkUHJvcHMsXG4gICAgICAgICAgbmV3UHJvcHMsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGF0Y2hGbGFnICYgMikge1xuICAgICAgICAgIGlmIChvbGRQcm9wcy5jbGFzcyAhPT0gbmV3UHJvcHMuY2xhc3MpIHtcbiAgICAgICAgICAgIGhvc3RQYXRjaFByb3AoZWwsIFwiY2xhc3NcIiwgbnVsbCwgbmV3UHJvcHMuY2xhc3MsIGlzU1ZHKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGNoRmxhZyAmIDQpIHtcbiAgICAgICAgICBob3N0UGF0Y2hQcm9wKGVsLCBcInN0eWxlXCIsIG9sZFByb3BzLnN0eWxlLCBuZXdQcm9wcy5zdHlsZSwgaXNTVkcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXRjaEZsYWcgJiA4KSB7XG4gICAgICAgICAgY29uc3QgcHJvcHNUb1VwZGF0ZSA9IG4yLmR5bmFtaWNQcm9wcztcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzVG9VcGRhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHByb3BzVG9VcGRhdGVbaV07XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gb2xkUHJvcHNba2V5XTtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBuZXdQcm9wc1trZXldO1xuICAgICAgICAgICAgaWYgKG5leHQgIT09IHByZXYgfHwga2V5ID09PSBcInZhbHVlXCIpIHtcbiAgICAgICAgICAgICAgaG9zdFBhdGNoUHJvcChcbiAgICAgICAgICAgICAgICBlbCxcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgcHJldixcbiAgICAgICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgICAgICAgIG4xLmNoaWxkcmVuLFxuICAgICAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICAgICAgICB1bm1vdW50Q2hpbGRyZW5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXRjaEZsYWcgJiAxKSB7XG4gICAgICAgIGlmIChuMS5jaGlsZHJlbiAhPT0gbjIuY2hpbGRyZW4pIHtcbiAgICAgICAgICBob3N0U2V0RWxlbWVudFRleHQoZWwsIG4yLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIW9wdGltaXplZCAmJiBkeW5hbWljQ2hpbGRyZW4gPT0gbnVsbCkge1xuICAgICAgcGF0Y2hQcm9wcyhcbiAgICAgICAgZWwsXG4gICAgICAgIG4yLFxuICAgICAgICBvbGRQcm9wcyxcbiAgICAgICAgbmV3UHJvcHMsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgIGlzU1ZHXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoKHZub2RlSG9vayA9IG5ld1Byb3BzLm9uVm5vZGVVcGRhdGVkKSB8fCBkaXJzKSB7XG4gICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xuICAgICAgICB2bm9kZUhvb2sgJiYgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCBuMiwgbjEpO1xuICAgICAgICBkaXJzICYmIGludm9rZURpcmVjdGl2ZUhvb2sobjIsIG4xLCBwYXJlbnRDb21wb25lbnQsIFwidXBkYXRlZFwiKTtcbiAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHBhdGNoQmxvY2tDaGlsZHJlbiA9IChvbGRDaGlsZHJlbiwgbmV3Q2hpbGRyZW4sIGZhbGxiYWNrQ29udGFpbmVyLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRywgc2xvdFNjb3BlSWRzKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgb2xkVk5vZGUgPSBvbGRDaGlsZHJlbltpXTtcbiAgICAgIGNvbnN0IG5ld1ZOb2RlID0gbmV3Q2hpbGRyZW5baV07XG4gICAgICBjb25zdCBjb250YWluZXIgPSAoXG4gICAgICAgIC8vIG9sZFZOb2RlIG1heSBiZSBhbiBlcnJvcmVkIGFzeW5jIHNldHVwKCkgY29tcG9uZW50IGluc2lkZSBTdXNwZW5zZVxuICAgICAgICAvLyB3aGljaCB3aWxsIG5vdCBoYXZlIGEgbW91bnRlZCBlbGVtZW50XG4gICAgICAgIG9sZFZOb2RlLmVsICYmIC8vIC0gSW4gdGhlIGNhc2Ugb2YgYSBGcmFnbWVudCwgd2UgbmVlZCB0byBwcm92aWRlIHRoZSBhY3R1YWwgcGFyZW50XG4gICAgICAgIC8vIG9mIHRoZSBGcmFnbWVudCBpdHNlbGYgc28gaXQgY2FuIG1vdmUgaXRzIGNoaWxkcmVuLlxuICAgICAgICAob2xkVk5vZGUudHlwZSA9PT0gRnJhZ21lbnQgfHwgLy8gLSBJbiB0aGUgY2FzZSBvZiBkaWZmZXJlbnQgbm9kZXMsIHRoZXJlIGlzIGdvaW5nIHRvIGJlIGEgcmVwbGFjZW1lbnRcbiAgICAgICAgLy8gd2hpY2ggYWxzbyByZXF1aXJlcyB0aGUgY29ycmVjdCBwYXJlbnQgY29udGFpbmVyXG4gICAgICAgICFpc1NhbWVWTm9kZVR5cGUob2xkVk5vZGUsIG5ld1ZOb2RlKSB8fCAvLyAtIEluIHRoZSBjYXNlIG9mIGEgY29tcG9uZW50LCBpdCBjb3VsZCBjb250YWluIGFueXRoaW5nLlxuICAgICAgICBvbGRWTm9kZS5zaGFwZUZsYWcgJiAoNiB8IDY0KSkgPyBob3N0UGFyZW50Tm9kZShvbGRWTm9kZS5lbCkgOiAoXG4gICAgICAgICAgLy8gSW4gb3RoZXIgY2FzZXMsIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIG5vdCBhY3R1YWxseSB1c2VkIHNvIHdlXG4gICAgICAgICAgLy8ganVzdCBwYXNzIHRoZSBibG9jayBlbGVtZW50IGhlcmUgdG8gYXZvaWQgYSBET00gcGFyZW50Tm9kZSBjYWxsLlxuICAgICAgICAgIGZhbGxiYWNrQ29udGFpbmVyXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBwYXRjaChcbiAgICAgICAgb2xkVk5vZGUsXG4gICAgICAgIG5ld1ZOb2RlLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgIGlzU1ZHLFxuICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgfVxuICB9O1xuICBjb25zdCBwYXRjaFByb3BzID0gKGVsLCB2bm9kZSwgb2xkUHJvcHMsIG5ld1Byb3BzLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBpc1NWRykgPT4ge1xuICAgIGlmIChvbGRQcm9wcyAhPT0gbmV3UHJvcHMpIHtcbiAgICAgIGlmIChvbGRQcm9wcyAhPT0gRU1QVFlfT0JKKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG9sZFByb3BzKSB7XG4gICAgICAgICAgaWYgKCFpc1Jlc2VydmVkUHJvcChrZXkpICYmICEoa2V5IGluIG5ld1Byb3BzKSkge1xuICAgICAgICAgICAgaG9zdFBhdGNoUHJvcChcbiAgICAgICAgICAgICAgZWwsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgb2xkUHJvcHNba2V5XSxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICAgIHZub2RlLmNoaWxkcmVuLFxuICAgICAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgICB1bm1vdW50Q2hpbGRyZW5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBuZXdQcm9wcykge1xuICAgICAgICBpZiAoaXNSZXNlcnZlZFByb3Aoa2V5KSlcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbmV4dCA9IG5ld1Byb3BzW2tleV07XG4gICAgICAgIGNvbnN0IHByZXYgPSBvbGRQcm9wc1trZXldO1xuICAgICAgICBpZiAobmV4dCAhPT0gcHJldiAmJiBrZXkgIT09IFwidmFsdWVcIikge1xuICAgICAgICAgIGhvc3RQYXRjaFByb3AoXG4gICAgICAgICAgICBlbCxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHByZXYsXG4gICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICB2bm9kZS5jaGlsZHJlbixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgdW5tb3VudENoaWxkcmVuXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBuZXdQcm9wcykge1xuICAgICAgICBob3N0UGF0Y2hQcm9wKGVsLCBcInZhbHVlXCIsIG9sZFByb3BzLnZhbHVlLCBuZXdQcm9wcy52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBwcm9jZXNzRnJhZ21lbnQgPSAobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgY29uc3QgZnJhZ21lbnRTdGFydEFuY2hvciA9IG4yLmVsID0gbjEgPyBuMS5lbCA6IGhvc3RDcmVhdGVUZXh0KFwiXCIpO1xuICAgIGNvbnN0IGZyYWdtZW50RW5kQW5jaG9yID0gbjIuYW5jaG9yID0gbjEgPyBuMS5hbmNob3IgOiBob3N0Q3JlYXRlVGV4dChcIlwiKTtcbiAgICBsZXQgeyBwYXRjaEZsYWcsIGR5bmFtaWNDaGlsZHJlbiwgc2xvdFNjb3BlSWRzOiBmcmFnbWVudFNsb3RTY29wZUlkcyB9ID0gbjI7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgLy8gIzU1MjMgZGV2IHJvb3QgZnJhZ21lbnQgbWF5IGluaGVyaXQgZGlyZWN0aXZlc1xuICAgIChpc0htclVwZGF0aW5nIHx8IHBhdGNoRmxhZyAmIDIwNDgpKSB7XG4gICAgICBwYXRjaEZsYWcgPSAwO1xuICAgICAgb3B0aW1pemVkID0gZmFsc2U7XG4gICAgICBkeW5hbWljQ2hpbGRyZW4gPSBudWxsO1xuICAgIH1cbiAgICBpZiAoZnJhZ21lbnRTbG90U2NvcGVJZHMpIHtcbiAgICAgIHNsb3RTY29wZUlkcyA9IHNsb3RTY29wZUlkcyA/IHNsb3RTY29wZUlkcy5jb25jYXQoZnJhZ21lbnRTbG90U2NvcGVJZHMpIDogZnJhZ21lbnRTbG90U2NvcGVJZHM7XG4gICAgfVxuICAgIGlmIChuMSA9PSBudWxsKSB7XG4gICAgICBob3N0SW5zZXJ0KGZyYWdtZW50U3RhcnRBbmNob3IsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgIGhvc3RJbnNlcnQoZnJhZ21lbnRFbmRBbmNob3IsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgIG1vdW50Q2hpbGRyZW4oXG4gICAgICAgIG4yLmNoaWxkcmVuLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGZyYWdtZW50RW5kQW5jaG9yLFxuICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICBpc1NWRyxcbiAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXRjaEZsYWcgPiAwICYmIHBhdGNoRmxhZyAmIDY0ICYmIGR5bmFtaWNDaGlsZHJlbiAmJiAvLyAjMjcxNSB0aGUgcHJldmlvdXMgZnJhZ21lbnQgY291bGQndmUgYmVlbiBhIEJBSUxlZCBvbmUgYXMgYSByZXN1bHRcbiAgICAgIC8vIG9mIHJlbmRlclNsb3QoKSB3aXRoIG5vIHZhbGlkIGNoaWxkcmVuXG4gICAgICBuMS5keW5hbWljQ2hpbGRyZW4pIHtcbiAgICAgICAgcGF0Y2hCbG9ja0NoaWxkcmVuKFxuICAgICAgICAgIG4xLmR5bmFtaWNDaGlsZHJlbixcbiAgICAgICAgICBkeW5hbWljQ2hpbGRyZW4sXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBzbG90U2NvcGVJZHNcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB0cmF2ZXJzZVN0YXRpY0NoaWxkcmVuKG4xLCBuMik7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgLy8gIzIwODAgaWYgdGhlIHN0YWJsZSBmcmFnbWVudCBoYXMgYSBrZXksIGl0J3MgYSA8dGVtcGxhdGUgdi1mb3I+IHRoYXQgbWF5XG4gICAgICAgICAgLy8gIGdldCBtb3ZlZCBhcm91bmQuIE1ha2Ugc3VyZSBhbGwgcm9vdCBsZXZlbCB2bm9kZXMgaW5oZXJpdCBlbC5cbiAgICAgICAgICAvLyAjMjEzNCBvciBpZiBpdCdzIGEgY29tcG9uZW50IHJvb3QsIGl0IG1heSBhbHNvIGdldCBtb3ZlZCBhcm91bmRcbiAgICAgICAgICAvLyBhcyB0aGUgY29tcG9uZW50IGlzIGJlaW5nIG1vdmVkLlxuICAgICAgICAgIG4yLmtleSAhPSBudWxsIHx8IHBhcmVudENvbXBvbmVudCAmJiBuMiA9PT0gcGFyZW50Q29tcG9uZW50LnN1YlRyZWVcbiAgICAgICAgKSB7XG4gICAgICAgICAgdHJhdmVyc2VTdGF0aWNDaGlsZHJlbihcbiAgICAgICAgICAgIG4xLFxuICAgICAgICAgICAgbjIsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAvKiBzaGFsbG93ICovXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0Y2hDaGlsZHJlbihcbiAgICAgICAgICBuMSxcbiAgICAgICAgICBuMixcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgZnJhZ21lbnRFbmRBbmNob3IsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHByb2Nlc3NDb21wb25lbnQgPSAobjEsIG4yLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgbjIuc2xvdFNjb3BlSWRzID0gc2xvdFNjb3BlSWRzO1xuICAgIGlmIChuMSA9PSBudWxsKSB7XG4gICAgICBpZiAobjIuc2hhcGVGbGFnICYgNTEyKSB7XG4gICAgICAgIHBhcmVudENvbXBvbmVudC5jdHguYWN0aXZhdGUoXG4gICAgICAgICAgbjIsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vdW50Q29tcG9uZW50KFxuICAgICAgICAgIG4yLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1cGRhdGVDb21wb25lbnQobjEsIG4yLCBvcHRpbWl6ZWQpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbW91bnRDb21wb25lbnQgPSAoaW5pdGlhbFZOb2RlLCBjb250YWluZXIsIGFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xuICAgIGNvbnN0IGluc3RhbmNlID0gKGluaXRpYWxWTm9kZS5jb21wb25lbnQgPSBjcmVhdGVDb21wb25lbnRJbnN0YW5jZShcbiAgICAgIGluaXRpYWxWTm9kZSxcbiAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgIHBhcmVudFN1c3BlbnNlXG4gICAgKSk7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgaW5zdGFuY2UudHlwZS5fX2htcklkKSB7XG4gICAgICByZWdpc3RlckhNUihpbnN0YW5jZSk7XG4gICAgfVxuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICBwdXNoV2FybmluZ0NvbnRleHQoaW5pdGlhbFZOb2RlKTtcbiAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYG1vdW50YCk7XG4gICAgfVxuICAgIGlmIChpc0tlZXBBbGl2ZShpbml0aWFsVk5vZGUpKSB7XG4gICAgICBpbnN0YW5jZS5jdHgucmVuZGVyZXIgPSBpbnRlcm5hbHM7XG4gICAgfVxuICAgIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYGluaXRgKTtcbiAgICAgIH1cbiAgICAgIHNldHVwQ29tcG9uZW50KGluc3RhbmNlKTtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGBpbml0YCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbnN0YW5jZS5hc3luY0RlcCkge1xuICAgICAgcGFyZW50U3VzcGVuc2UgJiYgcGFyZW50U3VzcGVuc2UucmVnaXN0ZXJEZXAoaW5zdGFuY2UsIHNldHVwUmVuZGVyRWZmZWN0KTtcbiAgICAgIGlmICghaW5pdGlhbFZOb2RlLmVsKSB7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gaW5zdGFuY2Uuc3ViVHJlZSA9IGNyZWF0ZVZOb2RlKENvbW1lbnQpO1xuICAgICAgICBwcm9jZXNzQ29tbWVudE5vZGUobnVsbCwgcGxhY2Vob2xkZXIsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0dXBSZW5kZXJFZmZlY3QoXG4gICAgICBpbnN0YW5jZSxcbiAgICAgIGluaXRpYWxWTm9kZSxcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGFuY2hvcixcbiAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgaXNTVkcsXG4gICAgICBvcHRpbWl6ZWRcbiAgICApO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICBwb3BXYXJuaW5nQ29udGV4dCgpO1xuICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYG1vdW50YCk7XG4gICAgfVxuICB9O1xuICBjb25zdCB1cGRhdGVDb21wb25lbnQgPSAobjEsIG4yLCBvcHRpbWl6ZWQpID0+IHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG4yLmNvbXBvbmVudCA9IG4xLmNvbXBvbmVudDtcbiAgICBpZiAoc2hvdWxkVXBkYXRlQ29tcG9uZW50KG4xLCBuMiwgb3B0aW1pemVkKSkge1xuICAgICAgaWYgKGluc3RhbmNlLmFzeW5jRGVwICYmICFpbnN0YW5jZS5hc3luY1Jlc29sdmVkKSB7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgcHVzaFdhcm5pbmdDb250ZXh0KG4yKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVDb21wb25lbnRQcmVSZW5kZXIoaW5zdGFuY2UsIG4yLCBvcHRpbWl6ZWQpO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHBvcFdhcm5pbmdDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UubmV4dCA9IG4yO1xuICAgICAgICBpbnZhbGlkYXRlSm9iKGluc3RhbmNlLnVwZGF0ZSk7XG4gICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuMi5lbCA9IG4xLmVsO1xuICAgICAgaW5zdGFuY2Uudm5vZGUgPSBuMjtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHNldHVwUmVuZGVyRWZmZWN0ID0gKGluc3RhbmNlLCBpbml0aWFsVk5vZGUsIGNvbnRhaW5lciwgYW5jaG9yLCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIG9wdGltaXplZCkgPT4ge1xuICAgIGNvbnN0IGNvbXBvbmVudFVwZGF0ZUZuID0gKCkgPT4ge1xuICAgICAgaWYgKCFpbnN0YW5jZS5pc01vdW50ZWQpIHtcbiAgICAgICAgbGV0IHZub2RlSG9vaztcbiAgICAgICAgY29uc3QgeyBlbCwgcHJvcHMgfSA9IGluaXRpYWxWTm9kZTtcbiAgICAgICAgY29uc3QgeyBibSwgbSwgcGFyZW50IH0gPSBpbnN0YW5jZTtcbiAgICAgICAgY29uc3QgaXNBc3luY1dyYXBwZXJWTm9kZSA9IGlzQXN5bmNXcmFwcGVyKGluaXRpYWxWTm9kZSk7XG4gICAgICAgIHRvZ2dsZVJlY3Vyc2UoaW5zdGFuY2UsIGZhbHNlKTtcbiAgICAgICAgaWYgKGJtKSB7XG4gICAgICAgICAgaW52b2tlQXJyYXlGbnMoYm0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNBc3luY1dyYXBwZXJWTm9kZSAmJiAodm5vZGVIb29rID0gcHJvcHMgJiYgcHJvcHMub25Wbm9kZUJlZm9yZU1vdW50KSkge1xuICAgICAgICAgIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudCwgaW5pdGlhbFZOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVSZWN1cnNlKGluc3RhbmNlLCB0cnVlKTtcbiAgICAgICAgaWYgKGVsICYmIGh5ZHJhdGVOb2RlKSB7XG4gICAgICAgICAgY29uc3QgaHlkcmF0ZVN1YlRyZWUgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgICAgICBzdGFydE1lYXN1cmUoaW5zdGFuY2UsIGByZW5kZXJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlLnN1YlRyZWUgPSByZW5kZXJDb21wb25lbnRSb290KGluc3RhbmNlKTtcbiAgICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGByZW5kZXJgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYGh5ZHJhdGVgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGh5ZHJhdGVOb2RlKFxuICAgICAgICAgICAgICBlbCxcbiAgICAgICAgICAgICAgaW5zdGFuY2Uuc3ViVHJlZSxcbiAgICAgICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgICBudWxsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYGh5ZHJhdGVgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0FzeW5jV3JhcHBlclZOb2RlKSB7XG4gICAgICAgICAgICBpbml0aWFsVk5vZGUudHlwZS5fX2FzeW5jTG9hZGVyKCkudGhlbihcbiAgICAgICAgICAgICAgLy8gbm90ZTogd2UgYXJlIG1vdmluZyB0aGUgcmVuZGVyIGNhbGwgaW50byBhbiBhc3luYyBjYWxsYmFjayxcbiAgICAgICAgICAgICAgLy8gd2hpY2ggbWVhbnMgaXQgd29uJ3QgdHJhY2sgZGVwZW5kZW5jaWVzIC0gYnV0IGl0J3Mgb2sgYmVjYXVzZVxuICAgICAgICAgICAgICAvLyBhIHNlcnZlci1yZW5kZXJlZCBhc3luYyB3cmFwcGVyIGlzIGFscmVhZHkgaW4gcmVzb2x2ZWQgc3RhdGVcbiAgICAgICAgICAgICAgLy8gYW5kIGl0IHdpbGwgbmV2ZXIgbmVlZCB0byBjaGFuZ2UuXG4gICAgICAgICAgICAgICgpID0+ICFpbnN0YW5jZS5pc1VubW91bnRlZCAmJiBoeWRyYXRlU3ViVHJlZSgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoeWRyYXRlU3ViVHJlZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgICAgc3RhcnRNZWFzdXJlKGluc3RhbmNlLCBgcmVuZGVyYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHN1YlRyZWUgPSBpbnN0YW5jZS5zdWJUcmVlID0gcmVuZGVyQ29tcG9uZW50Um9vdChpbnN0YW5jZSk7XG4gICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICAgIGVuZE1lYXN1cmUoaW5zdGFuY2UsIGByZW5kZXJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYHBhdGNoYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhdGNoKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHN1YlRyZWUsXG4gICAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkdcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgICBlbmRNZWFzdXJlKGluc3RhbmNlLCBgcGF0Y2hgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5pdGlhbFZOb2RlLmVsID0gc3ViVHJlZS5lbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobSkge1xuICAgICAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdChtLCBwYXJlbnRTdXNwZW5zZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0FzeW5jV3JhcHBlclZOb2RlICYmICh2bm9kZUhvb2sgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlTW91bnRlZCkpIHtcbiAgICAgICAgICBjb25zdCBzY29wZWRJbml0aWFsVk5vZGUgPSBpbml0aWFsVk5vZGU7XG4gICAgICAgICAgcXVldWVQb3N0UmVuZGVyRWZmZWN0KFxuICAgICAgICAgICAgKCkgPT4gaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50LCBzY29wZWRJbml0aWFsVk5vZGUpLFxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2VcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbml0aWFsVk5vZGUuc2hhcGVGbGFnICYgMjU2IHx8IHBhcmVudCAmJiBpc0FzeW5jV3JhcHBlcihwYXJlbnQudm5vZGUpICYmIHBhcmVudC52bm9kZS5zaGFwZUZsYWcgJiAyNTYpIHtcbiAgICAgICAgICBpbnN0YW5jZS5hICYmIHF1ZXVlUG9zdFJlbmRlckVmZmVjdChpbnN0YW5jZS5hLCBwYXJlbnRTdXNwZW5zZSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5zdGFuY2UuaXNNb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSB7XG4gICAgICAgICAgZGV2dG9vbHNDb21wb25lbnRBZGRlZChpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdGlhbFZOb2RlID0gY29udGFpbmVyID0gYW5jaG9yID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB7IG5leHQsIGJ1LCB1LCBwYXJlbnQsIHZub2RlIH0gPSBpbnN0YW5jZTtcbiAgICAgICAgbGV0IG9yaWdpbk5leHQgPSBuZXh0O1xuICAgICAgICBsZXQgdm5vZGVIb29rO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHB1c2hXYXJuaW5nQ29udGV4dChuZXh0IHx8IGluc3RhbmNlLnZub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVSZWN1cnNlKGluc3RhbmNlLCBmYWxzZSk7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgbmV4dC5lbCA9IHZub2RlLmVsO1xuICAgICAgICAgIHVwZGF0ZUNvbXBvbmVudFByZVJlbmRlcihpbnN0YW5jZSwgbmV4dCwgb3B0aW1pemVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0ID0gdm5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1KSB7XG4gICAgICAgICAgaW52b2tlQXJyYXlGbnMoYnUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2bm9kZUhvb2sgPSBuZXh0LnByb3BzICYmIG5leHQucHJvcHMub25Wbm9kZUJlZm9yZVVwZGF0ZSkge1xuICAgICAgICAgIGludm9rZVZOb2RlSG9vayh2bm9kZUhvb2ssIHBhcmVudCwgbmV4dCwgdm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVJlY3Vyc2UoaW5zdGFuY2UsIHRydWUpO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYHJlbmRlcmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5leHRUcmVlID0gcmVuZGVyQ29tcG9uZW50Um9vdChpbnN0YW5jZSk7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgZW5kTWVhc3VyZShpbnN0YW5jZSwgYHJlbmRlcmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZXZUcmVlID0gaW5zdGFuY2Uuc3ViVHJlZTtcbiAgICAgICAgaW5zdGFuY2Uuc3ViVHJlZSA9IG5leHRUcmVlO1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgIHN0YXJ0TWVhc3VyZShpbnN0YW5jZSwgYHBhdGNoYCk7XG4gICAgICAgIH1cbiAgICAgICAgcGF0Y2goXG4gICAgICAgICAgcHJldlRyZWUsXG4gICAgICAgICAgbmV4dFRyZWUsXG4gICAgICAgICAgLy8gcGFyZW50IG1heSBoYXZlIGNoYW5nZWQgaWYgaXQncyBpbiBhIHRlbGVwb3J0XG4gICAgICAgICAgaG9zdFBhcmVudE5vZGUocHJldlRyZWUuZWwpLFxuICAgICAgICAgIC8vIGFuY2hvciBtYXkgaGF2ZSBjaGFuZ2VkIGlmIGl0J3MgaW4gYSBmcmFnbWVudFxuICAgICAgICAgIGdldE5leHRIb3N0Tm9kZShwcmV2VHJlZSksXG4gICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkdcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKGluc3RhbmNlLCBgcGF0Y2hgKTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0LmVsID0gbmV4dFRyZWUuZWw7XG4gICAgICAgIGlmIChvcmlnaW5OZXh0ID09PSBudWxsKSB7XG4gICAgICAgICAgdXBkYXRlSE9DSG9zdEVsKGluc3RhbmNlLCBuZXh0VHJlZS5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHUpIHtcbiAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QodSwgcGFyZW50U3VzcGVuc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2bm9kZUhvb2sgPSBuZXh0LnByb3BzICYmIG5leHQucHJvcHMub25Wbm9kZVVwZGF0ZWQpIHtcbiAgICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoXG4gICAgICAgICAgICAoKSA9PiBpbnZva2VWTm9kZUhvb2sodm5vZGVIb29rLCBwYXJlbnQsIG5leHQsIHZub2RlKSxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB8fCBfX1ZVRV9QUk9EX0RFVlRPT0xTX18pIHtcbiAgICAgICAgICBkZXZ0b29sc0NvbXBvbmVudFVwZGF0ZWQoaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgcG9wV2FybmluZ0NvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgZWZmZWN0ID0gaW5zdGFuY2UuZWZmZWN0ID0gbmV3IFJlYWN0aXZlRWZmZWN0KFxuICAgICAgY29tcG9uZW50VXBkYXRlRm4sXG4gICAgICAoKSA9PiBxdWV1ZUpvYih1cGRhdGUpLFxuICAgICAgaW5zdGFuY2Uuc2NvcGVcbiAgICAgIC8vIHRyYWNrIGl0IGluIGNvbXBvbmVudCdzIGVmZmVjdCBzY29wZVxuICAgICk7XG4gICAgY29uc3QgdXBkYXRlID0gaW5zdGFuY2UudXBkYXRlID0gKCkgPT4gZWZmZWN0LnJ1bigpO1xuICAgIHVwZGF0ZS5pZCA9IGluc3RhbmNlLnVpZDtcbiAgICB0b2dnbGVSZWN1cnNlKGluc3RhbmNlLCB0cnVlKTtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgZWZmZWN0Lm9uVHJhY2sgPSBpbnN0YW5jZS5ydGMgPyAoZSkgPT4gaW52b2tlQXJyYXlGbnMoaW5zdGFuY2UucnRjLCBlKSA6IHZvaWQgMDtcbiAgICAgIGVmZmVjdC5vblRyaWdnZXIgPSBpbnN0YW5jZS5ydGcgPyAoZSkgPT4gaW52b2tlQXJyYXlGbnMoaW5zdGFuY2UucnRnLCBlKSA6IHZvaWQgMDtcbiAgICAgIHVwZGF0ZS5vd25lckluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgfVxuICAgIHVwZGF0ZSgpO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb21wb25lbnRQcmVSZW5kZXIgPSAoaW5zdGFuY2UsIG5leHRWTm9kZSwgb3B0aW1pemVkKSA9PiB7XG4gICAgbmV4dFZOb2RlLmNvbXBvbmVudCA9IGluc3RhbmNlO1xuICAgIGNvbnN0IHByZXZQcm9wcyA9IGluc3RhbmNlLnZub2RlLnByb3BzO1xuICAgIGluc3RhbmNlLnZub2RlID0gbmV4dFZOb2RlO1xuICAgIGluc3RhbmNlLm5leHQgPSBudWxsO1xuICAgIHVwZGF0ZVByb3BzKGluc3RhbmNlLCBuZXh0Vk5vZGUucHJvcHMsIHByZXZQcm9wcywgb3B0aW1pemVkKTtcbiAgICB1cGRhdGVTbG90cyhpbnN0YW5jZSwgbmV4dFZOb2RlLmNoaWxkcmVuLCBvcHRpbWl6ZWQpO1xuICAgIHBhdXNlVHJhY2tpbmcoKTtcbiAgICBmbHVzaFByZUZsdXNoQ2JzKCk7XG4gICAgcmVzZXRUcmFja2luZygpO1xuICB9O1xuICBjb25zdCBwYXRjaENoaWxkcmVuID0gKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgYzEgPSBuMSAmJiBuMS5jaGlsZHJlbjtcbiAgICBjb25zdCBwcmV2U2hhcGVGbGFnID0gbjEgPyBuMS5zaGFwZUZsYWcgOiAwO1xuICAgIGNvbnN0IGMyID0gbjIuY2hpbGRyZW47XG4gICAgY29uc3QgeyBwYXRjaEZsYWcsIHNoYXBlRmxhZyB9ID0gbjI7XG4gICAgaWYgKHBhdGNoRmxhZyA+IDApIHtcbiAgICAgIGlmIChwYXRjaEZsYWcgJiAxMjgpIHtcbiAgICAgICAgcGF0Y2hLZXllZENoaWxkcmVuKFxuICAgICAgICAgIGMxLFxuICAgICAgICAgIGMyLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBhbmNob3IsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIGlzU1ZHLFxuICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChwYXRjaEZsYWcgJiAyNTYpIHtcbiAgICAgICAgcGF0Y2hVbmtleWVkQ2hpbGRyZW4oXG4gICAgICAgICAgYzEsXG4gICAgICAgICAgYzIsXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzaGFwZUZsYWcgJiA4KSB7XG4gICAgICBpZiAocHJldlNoYXBlRmxhZyAmIDE2KSB7XG4gICAgICAgIHVubW91bnRDaGlsZHJlbihjMSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSk7XG4gICAgICB9XG4gICAgICBpZiAoYzIgIT09IGMxKSB7XG4gICAgICAgIGhvc3RTZXRFbGVtZW50VGV4dChjb250YWluZXIsIGMyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHByZXZTaGFwZUZsYWcgJiAxNikge1xuICAgICAgICBpZiAoc2hhcGVGbGFnICYgMTYpIHtcbiAgICAgICAgICBwYXRjaEtleWVkQ2hpbGRyZW4oXG4gICAgICAgICAgICBjMSxcbiAgICAgICAgICAgIGMyLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgYW5jaG9yLFxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5tb3VudENoaWxkcmVuKGMxLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByZXZTaGFwZUZsYWcgJiA4KSB7XG4gICAgICAgICAgaG9zdFNldEVsZW1lbnRUZXh0KGNvbnRhaW5lciwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYXBlRmxhZyAmIDE2KSB7XG4gICAgICAgICAgbW91bnRDaGlsZHJlbihcbiAgICAgICAgICAgIGMyLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgYW5jaG9yLFxuICAgICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHBhdGNoVW5rZXllZENoaWxkcmVuID0gKGMxLCBjMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCkgPT4ge1xuICAgIGMxID0gYzEgfHwgRU1QVFlfQVJSO1xuICAgIGMyID0gYzIgfHwgRU1QVFlfQVJSO1xuICAgIGNvbnN0IG9sZExlbmd0aCA9IGMxLmxlbmd0aDtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBjMi5sZW5ndGg7XG4gICAgY29uc3QgY29tbW9uTGVuZ3RoID0gTWF0aC5taW4ob2xkTGVuZ3RoLCBuZXdMZW5ndGgpO1xuICAgIGxldCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBjb21tb25MZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbmV4dENoaWxkID0gYzJbaV0gPSBvcHRpbWl6ZWQgPyBjbG9uZUlmTW91bnRlZChjMltpXSkgOiBub3JtYWxpemVWTm9kZShjMltpXSk7XG4gICAgICBwYXRjaChcbiAgICAgICAgYzFbaV0sXG4gICAgICAgIG5leHRDaGlsZCxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBudWxsLFxuICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICBpc1NWRyxcbiAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChvbGRMZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgIHVubW91bnRDaGlsZHJlbihcbiAgICAgICAgYzEsXG4gICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgIHRydWUsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBjb21tb25MZW5ndGhcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdW50Q2hpbGRyZW4oXG4gICAgICAgIGMyLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgaXNTVkcsXG4gICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgb3B0aW1pemVkLFxuICAgICAgICBjb21tb25MZW5ndGhcbiAgICAgICk7XG4gICAgfVxuICB9O1xuICBjb25zdCBwYXRjaEtleWVkQ2hpbGRyZW4gPSAoYzEsIGMyLCBjb250YWluZXIsIHBhcmVudEFuY2hvciwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgaXNTVkcsIHNsb3RTY29wZUlkcywgb3B0aW1pemVkKSA9PiB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGwyID0gYzIubGVuZ3RoO1xuICAgIGxldCBlMSA9IGMxLmxlbmd0aCAtIDE7XG4gICAgbGV0IGUyID0gbDIgLSAxO1xuICAgIHdoaWxlIChpIDw9IGUxICYmIGkgPD0gZTIpIHtcbiAgICAgIGNvbnN0IG4xID0gYzFbaV07XG4gICAgICBjb25zdCBuMiA9IGMyW2ldID0gb3B0aW1pemVkID8gY2xvbmVJZk1vdW50ZWQoYzJbaV0pIDogbm9ybWFsaXplVk5vZGUoYzJbaV0pO1xuICAgICAgaWYgKGlzU2FtZVZOb2RlVHlwZShuMSwgbjIpKSB7XG4gICAgICAgIHBhdGNoKFxuICAgICAgICAgIG4xLFxuICAgICAgICAgIG4yLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgd2hpbGUgKGkgPD0gZTEgJiYgaSA8PSBlMikge1xuICAgICAgY29uc3QgbjEgPSBjMVtlMV07XG4gICAgICBjb25zdCBuMiA9IGMyW2UyXSA9IG9wdGltaXplZCA/IGNsb25lSWZNb3VudGVkKGMyW2UyXSkgOiBub3JtYWxpemVWTm9kZShjMltlMl0pO1xuICAgICAgaWYgKGlzU2FtZVZOb2RlVHlwZShuMSwgbjIpKSB7XG4gICAgICAgIHBhdGNoKFxuICAgICAgICAgIG4xLFxuICAgICAgICAgIG4yLFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBpc1NWRyxcbiAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgb3B0aW1pemVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGUxLS07XG4gICAgICBlMi0tO1xuICAgIH1cbiAgICBpZiAoaSA+IGUxKSB7XG4gICAgICBpZiAoaSA8PSBlMikge1xuICAgICAgICBjb25zdCBuZXh0UG9zID0gZTIgKyAxO1xuICAgICAgICBjb25zdCBhbmNob3IgPSBuZXh0UG9zIDwgbDIgPyBjMltuZXh0UG9zXS5lbCA6IHBhcmVudEFuY2hvcjtcbiAgICAgICAgd2hpbGUgKGkgPD0gZTIpIHtcbiAgICAgICAgICBwYXRjaChcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBjMltpXSA9IG9wdGltaXplZCA/IGNsb25lSWZNb3VudGVkKGMyW2ldKSA6IG5vcm1hbGl6ZVZOb2RlKGMyW2ldKSxcbiAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaSA+IGUyKSB7XG4gICAgICB3aGlsZSAoaSA8PSBlMSkge1xuICAgICAgICB1bm1vdW50KGMxW2ldLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzMSA9IGk7XG4gICAgICBjb25zdCBzMiA9IGk7XG4gICAgICBjb25zdCBrZXlUb05ld0luZGV4TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICAgIGZvciAoaSA9IHMyOyBpIDw9IGUyOyBpKyspIHtcbiAgICAgICAgY29uc3QgbmV4dENoaWxkID0gYzJbaV0gPSBvcHRpbWl6ZWQgPyBjbG9uZUlmTW91bnRlZChjMltpXSkgOiBub3JtYWxpemVWTm9kZShjMltpXSk7XG4gICAgICAgIGlmIChuZXh0Q2hpbGQua2V5ICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBrZXlUb05ld0luZGV4TWFwLmhhcyhuZXh0Q2hpbGQua2V5KSkge1xuICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgYER1cGxpY2F0ZSBrZXlzIGZvdW5kIGR1cmluZyB1cGRhdGU6YCxcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkobmV4dENoaWxkLmtleSksXG4gICAgICAgICAgICAgIGBNYWtlIHN1cmUga2V5cyBhcmUgdW5pcXVlLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGtleVRvTmV3SW5kZXhNYXAuc2V0KG5leHRDaGlsZC5rZXksIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgajtcbiAgICAgIGxldCBwYXRjaGVkID0gMDtcbiAgICAgIGNvbnN0IHRvQmVQYXRjaGVkID0gZTIgLSBzMiArIDE7XG4gICAgICBsZXQgbW92ZWQgPSBmYWxzZTtcbiAgICAgIGxldCBtYXhOZXdJbmRleFNvRmFyID0gMDtcbiAgICAgIGNvbnN0IG5ld0luZGV4VG9PbGRJbmRleE1hcCA9IG5ldyBBcnJheSh0b0JlUGF0Y2hlZCk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdG9CZVBhdGNoZWQ7IGkrKylcbiAgICAgICAgbmV3SW5kZXhUb09sZEluZGV4TWFwW2ldID0gMDtcbiAgICAgIGZvciAoaSA9IHMxOyBpIDw9IGUxOyBpKyspIHtcbiAgICAgICAgY29uc3QgcHJldkNoaWxkID0gYzFbaV07XG4gICAgICAgIGlmIChwYXRjaGVkID49IHRvQmVQYXRjaGVkKSB7XG4gICAgICAgICAgdW5tb3VudChwcmV2Q2hpbGQsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIHRydWUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuZXdJbmRleDtcbiAgICAgICAgaWYgKHByZXZDaGlsZC5rZXkgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld0luZGV4ID0ga2V5VG9OZXdJbmRleE1hcC5nZXQocHJldkNoaWxkLmtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yIChqID0gczI7IGogPD0gZTI7IGorKykge1xuICAgICAgICAgICAgaWYgKG5ld0luZGV4VG9PbGRJbmRleE1hcFtqIC0gczJdID09PSAwICYmIGlzU2FtZVZOb2RlVHlwZShwcmV2Q2hpbGQsIGMyW2pdKSkge1xuICAgICAgICAgICAgICBuZXdJbmRleCA9IGo7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3SW5kZXggPT09IHZvaWQgMCkge1xuICAgICAgICAgIHVubW91bnQocHJldkNoaWxkLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdJbmRleFRvT2xkSW5kZXhNYXBbbmV3SW5kZXggLSBzMl0gPSBpICsgMTtcbiAgICAgICAgICBpZiAobmV3SW5kZXggPj0gbWF4TmV3SW5kZXhTb0Zhcikge1xuICAgICAgICAgICAgbWF4TmV3SW5kZXhTb0ZhciA9IG5ld0luZGV4O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhdGNoKFxuICAgICAgICAgICAgcHJldkNoaWxkLFxuICAgICAgICAgICAgYzJbbmV3SW5kZXhdLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICAgIHBhdGNoZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgaW5jcmVhc2luZ05ld0luZGV4U2VxdWVuY2UgPSBtb3ZlZCA/IGdldFNlcXVlbmNlKG5ld0luZGV4VG9PbGRJbmRleE1hcCkgOiBFTVBUWV9BUlI7XG4gICAgICBqID0gaW5jcmVhc2luZ05ld0luZGV4U2VxdWVuY2UubGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoaSA9IHRvQmVQYXRjaGVkIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gczIgKyBpO1xuICAgICAgICBjb25zdCBuZXh0Q2hpbGQgPSBjMltuZXh0SW5kZXhdO1xuICAgICAgICBjb25zdCBhbmNob3IgPSBuZXh0SW5kZXggKyAxIDwgbDIgPyBjMltuZXh0SW5kZXggKyAxXS5lbCA6IHBhcmVudEFuY2hvcjtcbiAgICAgICAgaWYgKG5ld0luZGV4VG9PbGRJbmRleE1hcFtpXSA9PT0gMCkge1xuICAgICAgICAgIHBhdGNoKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIG5leHRDaGlsZCxcbiAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgIGFuY2hvcixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdmVkKSB7XG4gICAgICAgICAgaWYgKGogPCAwIHx8IGkgIT09IGluY3JlYXNpbmdOZXdJbmRleFNlcXVlbmNlW2pdKSB7XG4gICAgICAgICAgICBtb3ZlKG5leHRDaGlsZCwgY29udGFpbmVyLCBhbmNob3IsIDIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBtb3ZlID0gKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgbW92ZVR5cGUsIHBhcmVudFN1c3BlbnNlID0gbnVsbCkgPT4ge1xuICAgIGNvbnN0IHsgZWwsIHR5cGUsIHRyYW5zaXRpb24sIGNoaWxkcmVuLCBzaGFwZUZsYWcgfSA9IHZub2RlO1xuICAgIGlmIChzaGFwZUZsYWcgJiA2KSB7XG4gICAgICBtb3ZlKHZub2RlLmNvbXBvbmVudC5zdWJUcmVlLCBjb250YWluZXIsIGFuY2hvciwgbW92ZVR5cGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoc2hhcGVGbGFnICYgMTI4KSB7XG4gICAgICB2bm9kZS5zdXNwZW5zZS5tb3ZlKGNvbnRhaW5lciwgYW5jaG9yLCBtb3ZlVHlwZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaGFwZUZsYWcgJiA2NCkge1xuICAgICAgdHlwZS5tb3ZlKHZub2RlLCBjb250YWluZXIsIGFuY2hvciwgaW50ZXJuYWxzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09IEZyYWdtZW50KSB7XG4gICAgICBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIGFuY2hvcik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vdmUoY2hpbGRyZW5baV0sIGNvbnRhaW5lciwgYW5jaG9yLCBtb3ZlVHlwZSk7XG4gICAgICB9XG4gICAgICBob3N0SW5zZXJ0KHZub2RlLmFuY2hvciwgY29udGFpbmVyLCBhbmNob3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gU3RhdGljKSB7XG4gICAgICBtb3ZlU3RhdGljTm9kZSh2bm9kZSwgY29udGFpbmVyLCBhbmNob3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZWVkVHJhbnNpdGlvbiA9IG1vdmVUeXBlICE9PSAyICYmIHNoYXBlRmxhZyAmIDEgJiYgdHJhbnNpdGlvbjtcbiAgICBpZiAobmVlZFRyYW5zaXRpb24pIHtcbiAgICAgIGlmIChtb3ZlVHlwZSA9PT0gMCkge1xuICAgICAgICB0cmFuc2l0aW9uLmJlZm9yZUVudGVyKGVsKTtcbiAgICAgICAgaG9zdEluc2VydChlbCwgY29udGFpbmVyLCBhbmNob3IpO1xuICAgICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4gdHJhbnNpdGlvbi5lbnRlcihlbCksIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgbGVhdmUsIGRlbGF5TGVhdmUsIGFmdGVyTGVhdmUgfSA9IHRyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHJlbW92ZTIgPSAoKSA9PiBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIGFuY2hvcik7XG4gICAgICAgIGNvbnN0IHBlcmZvcm1MZWF2ZSA9ICgpID0+IHtcbiAgICAgICAgICBsZWF2ZShlbCwgKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlMigpO1xuICAgICAgICAgICAgYWZ0ZXJMZWF2ZSAmJiBhZnRlckxlYXZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChkZWxheUxlYXZlKSB7XG4gICAgICAgICAgZGVsYXlMZWF2ZShlbCwgcmVtb3ZlMiwgcGVyZm9ybUxlYXZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJmb3JtTGVhdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBob3N0SW5zZXJ0KGVsLCBjb250YWluZXIsIGFuY2hvcik7XG4gICAgfVxuICB9O1xuICBjb25zdCB1bm1vdW50ID0gKHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSA9IGZhbHNlLCBvcHRpbWl6ZWQgPSBmYWxzZSkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHR5cGUsXG4gICAgICBwcm9wcyxcbiAgICAgIHJlZixcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgZHluYW1pY0NoaWxkcmVuLFxuICAgICAgc2hhcGVGbGFnLFxuICAgICAgcGF0Y2hGbGFnLFxuICAgICAgZGlyc1xuICAgIH0gPSB2bm9kZTtcbiAgICBpZiAocmVmICE9IG51bGwpIHtcbiAgICAgIHNldFJlZihyZWYsIG51bGwsIHBhcmVudFN1c3BlbnNlLCB2bm9kZSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChzaGFwZUZsYWcgJiAyNTYpIHtcbiAgICAgIHBhcmVudENvbXBvbmVudC5jdHguZGVhY3RpdmF0ZSh2bm9kZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNob3VsZEludm9rZURpcnMgPSBzaGFwZUZsYWcgJiAxICYmIGRpcnM7XG4gICAgY29uc3Qgc2hvdWxkSW52b2tlVm5vZGVIb29rID0gIWlzQXN5bmNXcmFwcGVyKHZub2RlKTtcbiAgICBsZXQgdm5vZGVIb29rO1xuICAgIGlmIChzaG91bGRJbnZva2VWbm9kZUhvb2sgJiYgKHZub2RlSG9vayA9IHByb3BzICYmIHByb3BzLm9uVm5vZGVCZWZvcmVVbm1vdW50KSkge1xuICAgICAgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCB2bm9kZSk7XG4gICAgfVxuICAgIGlmIChzaGFwZUZsYWcgJiA2KSB7XG4gICAgICB1bm1vdW50Q29tcG9uZW50KHZub2RlLmNvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGRvUmVtb3ZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHNoYXBlRmxhZyAmIDEyOCkge1xuICAgICAgICB2bm9kZS5zdXNwZW5zZS51bm1vdW50KHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChzaG91bGRJbnZva2VEaXJzKSB7XG4gICAgICAgIGludm9rZURpcmVjdGl2ZUhvb2sodm5vZGUsIG51bGwsIHBhcmVudENvbXBvbmVudCwgXCJiZWZvcmVVbm1vdW50XCIpO1xuICAgICAgfVxuICAgICAgaWYgKHNoYXBlRmxhZyAmIDY0KSB7XG4gICAgICAgIHZub2RlLnR5cGUucmVtb3ZlKFxuICAgICAgICAgIHZub2RlLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBvcHRpbWl6ZWQsXG4gICAgICAgICAgaW50ZXJuYWxzLFxuICAgICAgICAgIGRvUmVtb3ZlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGR5bmFtaWNDaGlsZHJlbiAmJiAvLyAjMTE1MzogZmFzdCBwYXRoIHNob3VsZCBub3QgYmUgdGFrZW4gZm9yIG5vbi1zdGFibGUgKHYtZm9yKSBmcmFnbWVudHNcbiAgICAgICh0eXBlICE9PSBGcmFnbWVudCB8fCBwYXRjaEZsYWcgPiAwICYmIHBhdGNoRmxhZyAmIDY0KSkge1xuICAgICAgICB1bm1vdW50Q2hpbGRyZW4oXG4gICAgICAgICAgZHluYW1pY0NoaWxkcmVuLFxuICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICBwYXJlbnRTdXNwZW5zZSxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IEZyYWdtZW50ICYmIHBhdGNoRmxhZyAmICgxMjggfCAyNTYpIHx8ICFvcHRpbWl6ZWQgJiYgc2hhcGVGbGFnICYgMTYpIHtcbiAgICAgICAgdW5tb3VudENoaWxkcmVuKGNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlKTtcbiAgICAgIH1cbiAgICAgIGlmIChkb1JlbW92ZSkge1xuICAgICAgICByZW1vdmUodm5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hvdWxkSW52b2tlVm5vZGVIb29rICYmICh2bm9kZUhvb2sgPSBwcm9wcyAmJiBwcm9wcy5vblZub2RlVW5tb3VudGVkKSB8fCBzaG91bGRJbnZva2VEaXJzKSB7XG4gICAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xuICAgICAgICB2bm9kZUhvb2sgJiYgaW52b2tlVk5vZGVIb29rKHZub2RlSG9vaywgcGFyZW50Q29tcG9uZW50LCB2bm9kZSk7XG4gICAgICAgIHNob3VsZEludm9rZURpcnMgJiYgaW52b2tlRGlyZWN0aXZlSG9vayh2bm9kZSwgbnVsbCwgcGFyZW50Q29tcG9uZW50LCBcInVubW91bnRlZFwiKTtcbiAgICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHJlbW92ZSA9ICh2bm9kZSkgPT4ge1xuICAgIGNvbnN0IHsgdHlwZSwgZWwsIGFuY2hvciwgdHJhbnNpdGlvbiB9ID0gdm5vZGU7XG4gICAgaWYgKHR5cGUgPT09IEZyYWdtZW50KSB7XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB2bm9kZS5wYXRjaEZsYWcgPiAwICYmIHZub2RlLnBhdGNoRmxhZyAmIDIwNDggJiYgdHJhbnNpdGlvbiAmJiAhdHJhbnNpdGlvbi5wZXJzaXN0ZWQpIHtcbiAgICAgICAgdm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gQ29tbWVudCkge1xuICAgICAgICAgICAgaG9zdFJlbW92ZShjaGlsZC5lbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZShjaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZUZyYWdtZW50KGVsLCBhbmNob3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gU3RhdGljKSB7XG4gICAgICByZW1vdmVTdGF0aWNOb2RlKHZub2RlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGVyZm9ybVJlbW92ZSA9ICgpID0+IHtcbiAgICAgIGhvc3RSZW1vdmUoZWwpO1xuICAgICAgaWYgKHRyYW5zaXRpb24gJiYgIXRyYW5zaXRpb24ucGVyc2lzdGVkICYmIHRyYW5zaXRpb24uYWZ0ZXJMZWF2ZSkge1xuICAgICAgICB0cmFuc2l0aW9uLmFmdGVyTGVhdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiAxICYmIHRyYW5zaXRpb24gJiYgIXRyYW5zaXRpb24ucGVyc2lzdGVkKSB7XG4gICAgICBjb25zdCB7IGxlYXZlLCBkZWxheUxlYXZlIH0gPSB0cmFuc2l0aW9uO1xuICAgICAgY29uc3QgcGVyZm9ybUxlYXZlID0gKCkgPT4gbGVhdmUoZWwsIHBlcmZvcm1SZW1vdmUpO1xuICAgICAgaWYgKGRlbGF5TGVhdmUpIHtcbiAgICAgICAgZGVsYXlMZWF2ZSh2bm9kZS5lbCwgcGVyZm9ybVJlbW92ZSwgcGVyZm9ybUxlYXZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcmZvcm1MZWF2ZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwZXJmb3JtUmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCByZW1vdmVGcmFnbWVudCA9IChjdXIsIGVuZCkgPT4ge1xuICAgIGxldCBuZXh0O1xuICAgIHdoaWxlIChjdXIgIT09IGVuZCkge1xuICAgICAgbmV4dCA9IGhvc3ROZXh0U2libGluZyhjdXIpO1xuICAgICAgaG9zdFJlbW92ZShjdXIpO1xuICAgICAgY3VyID0gbmV4dDtcbiAgICB9XG4gICAgaG9zdFJlbW92ZShlbmQpO1xuICB9O1xuICBjb25zdCB1bm1vdW50Q29tcG9uZW50ID0gKGluc3RhbmNlLCBwYXJlbnRTdXNwZW5zZSwgZG9SZW1vdmUpID0+IHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBpbnN0YW5jZS50eXBlLl9faG1ySWQpIHtcbiAgICAgIHVucmVnaXN0ZXJITVIoaW5zdGFuY2UpO1xuICAgIH1cbiAgICBjb25zdCB7IGJ1bSwgc2NvcGUsIHVwZGF0ZSwgc3ViVHJlZSwgdW0gfSA9IGluc3RhbmNlO1xuICAgIGlmIChidW0pIHtcbiAgICAgIGludm9rZUFycmF5Rm5zKGJ1bSk7XG4gICAgfVxuICAgIHNjb3BlLnN0b3AoKTtcbiAgICBpZiAodXBkYXRlKSB7XG4gICAgICB1cGRhdGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICB1bm1vdW50KHN1YlRyZWUsIGluc3RhbmNlLCBwYXJlbnRTdXNwZW5zZSwgZG9SZW1vdmUpO1xuICAgIH1cbiAgICBpZiAodW0pIHtcbiAgICAgIHF1ZXVlUG9zdFJlbmRlckVmZmVjdCh1bSwgcGFyZW50U3VzcGVuc2UpO1xuICAgIH1cbiAgICBxdWV1ZVBvc3RSZW5kZXJFZmZlY3QoKCkgPT4ge1xuICAgICAgaW5zdGFuY2UuaXNVbm1vdW50ZWQgPSB0cnVlO1xuICAgIH0sIHBhcmVudFN1c3BlbnNlKTtcbiAgICBpZiAocGFyZW50U3VzcGVuc2UgJiYgcGFyZW50U3VzcGVuc2UucGVuZGluZ0JyYW5jaCAmJiAhcGFyZW50U3VzcGVuc2UuaXNVbm1vdW50ZWQgJiYgaW5zdGFuY2UuYXN5bmNEZXAgJiYgIWluc3RhbmNlLmFzeW5jUmVzb2x2ZWQgJiYgaW5zdGFuY2Uuc3VzcGVuc2VJZCA9PT0gcGFyZW50U3VzcGVuc2UucGVuZGluZ0lkKSB7XG4gICAgICBwYXJlbnRTdXNwZW5zZS5kZXBzLS07XG4gICAgICBpZiAocGFyZW50U3VzcGVuc2UuZGVwcyA9PT0gMCkge1xuICAgICAgICBwYXJlbnRTdXNwZW5zZS5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykge1xuICAgICAgZGV2dG9vbHNDb21wb25lbnRSZW1vdmVkKGluc3RhbmNlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHVubW91bnRDaGlsZHJlbiA9IChjaGlsZHJlbiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgZG9SZW1vdmUgPSBmYWxzZSwgb3B0aW1pemVkID0gZmFsc2UsIHN0YXJ0ID0gMCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB1bm1vdW50KGNoaWxkcmVuW2ldLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBkb1JlbW92ZSwgb3B0aW1pemVkKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGdldE5leHRIb3N0Tm9kZSA9ICh2bm9kZSkgPT4ge1xuICAgIGlmICh2bm9kZS5zaGFwZUZsYWcgJiA2KSB7XG4gICAgICByZXR1cm4gZ2V0TmV4dEhvc3ROb2RlKHZub2RlLmNvbXBvbmVudC5zdWJUcmVlKTtcbiAgICB9XG4gICAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDEyOCkge1xuICAgICAgcmV0dXJuIHZub2RlLnN1c3BlbnNlLm5leHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhvc3ROZXh0U2libGluZyh2bm9kZS5hbmNob3IgfHwgdm5vZGUuZWwpO1xuICB9O1xuICBjb25zdCByZW5kZXIgPSAodm5vZGUsIGNvbnRhaW5lciwgaXNTVkcpID0+IHtcbiAgICBpZiAodm5vZGUgPT0gbnVsbCkge1xuICAgICAgaWYgKGNvbnRhaW5lci5fdm5vZGUpIHtcbiAgICAgICAgdW5tb3VudChjb250YWluZXIuX3Zub2RlLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGF0Y2goY29udGFpbmVyLl92bm9kZSB8fCBudWxsLCB2bm9kZSwgY29udGFpbmVyLCBudWxsLCBudWxsLCBudWxsLCBpc1NWRyk7XG4gICAgfVxuICAgIGZsdXNoUHJlRmx1c2hDYnMoKTtcbiAgICBmbHVzaFBvc3RGbHVzaENicygpO1xuICAgIGNvbnRhaW5lci5fdm5vZGUgPSB2bm9kZTtcbiAgfTtcbiAgY29uc3QgaW50ZXJuYWxzID0ge1xuICAgIHA6IHBhdGNoLFxuICAgIHVtOiB1bm1vdW50LFxuICAgIG06IG1vdmUsXG4gICAgcjogcmVtb3ZlLFxuICAgIG10OiBtb3VudENvbXBvbmVudCxcbiAgICBtYzogbW91bnRDaGlsZHJlbixcbiAgICBwYzogcGF0Y2hDaGlsZHJlbixcbiAgICBwYmM6IHBhdGNoQmxvY2tDaGlsZHJlbixcbiAgICBuOiBnZXROZXh0SG9zdE5vZGUsXG4gICAgbzogb3B0aW9uc1xuICB9O1xuICBsZXQgaHlkcmF0ZTtcbiAgbGV0IGh5ZHJhdGVOb2RlO1xuICBpZiAoY3JlYXRlSHlkcmF0aW9uRm5zKSB7XG4gICAgW2h5ZHJhdGUsIGh5ZHJhdGVOb2RlXSA9IGNyZWF0ZUh5ZHJhdGlvbkZucyhcbiAgICAgIGludGVybmFsc1xuICAgICk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByZW5kZXIsXG4gICAgaHlkcmF0ZSxcbiAgICBjcmVhdGVBcHA6IGNyZWF0ZUFwcEFQSShyZW5kZXIsIGh5ZHJhdGUpXG4gIH07XG59XG5mdW5jdGlvbiB0b2dnbGVSZWN1cnNlKHsgZWZmZWN0LCB1cGRhdGUgfSwgYWxsb3dlZCkge1xuICBlZmZlY3QuYWxsb3dSZWN1cnNlID0gdXBkYXRlLmFsbG93UmVjdXJzZSA9IGFsbG93ZWQ7XG59XG5mdW5jdGlvbiB0cmF2ZXJzZVN0YXRpY0NoaWxkcmVuKG4xLCBuMiwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIGNvbnN0IGNoMSA9IG4xLmNoaWxkcmVuO1xuICBjb25zdCBjaDIgPSBuMi5jaGlsZHJlbjtcbiAgaWYgKGlzQXJyYXkoY2gxKSAmJiBpc0FycmF5KGNoMikpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoMS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYzEgPSBjaDFbaV07XG4gICAgICBsZXQgYzIgPSBjaDJbaV07XG4gICAgICBpZiAoYzIuc2hhcGVGbGFnICYgMSAmJiAhYzIuZHluYW1pY0NoaWxkcmVuKSB7XG4gICAgICAgIGlmIChjMi5wYXRjaEZsYWcgPD0gMCB8fCBjMi5wYXRjaEZsYWcgPT09IDMyKSB7XG4gICAgICAgICAgYzIgPSBjaDJbaV0gPSBjbG9uZUlmTW91bnRlZChjaDJbaV0pO1xuICAgICAgICAgIGMyLmVsID0gYzEuZWw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzaGFsbG93KVxuICAgICAgICAgIHRyYXZlcnNlU3RhdGljQ2hpbGRyZW4oYzEsIGMyKTtcbiAgICAgIH1cbiAgICAgIGlmIChjMi50eXBlID09PSBUZXh0KSB7XG4gICAgICAgIGMyLmVsID0gYzEuZWw7XG4gICAgICB9XG4gICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBjMi50eXBlID09PSBDb21tZW50ICYmICFjMi5lbCkge1xuICAgICAgICBjMi5lbCA9IGMxLmVsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZ2V0U2VxdWVuY2UoYXJyKSB7XG4gIGNvbnN0IHAgPSBhcnIuc2xpY2UoKTtcbiAgY29uc3QgcmVzdWx0ID0gWzBdO1xuICBsZXQgaSwgaiwgdSwgdiwgYztcbiAgY29uc3QgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgYXJySSA9IGFycltpXTtcbiAgICBpZiAoYXJySSAhPT0gMCkge1xuICAgICAgaiA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoYXJyW2pdIDwgYXJySSkge1xuICAgICAgICBwW2ldID0gajtcbiAgICAgICAgcmVzdWx0LnB1c2goaSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdSA9IDA7XG4gICAgICB2ID0gcmVzdWx0Lmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAodSA8IHYpIHtcbiAgICAgICAgYyA9IHUgKyB2ID4+IDE7XG4gICAgICAgIGlmIChhcnJbcmVzdWx0W2NdXSA8IGFyckkpIHtcbiAgICAgICAgICB1ID0gYyArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdiA9IGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChhcnJJIDwgYXJyW3Jlc3VsdFt1XV0pIHtcbiAgICAgICAgaWYgKHUgPiAwKSB7XG4gICAgICAgICAgcFtpXSA9IHJlc3VsdFt1IC0gMV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W3VdID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdSA9IHJlc3VsdC5sZW5ndGg7XG4gIHYgPSByZXN1bHRbdSAtIDFdO1xuICB3aGlsZSAodS0tID4gMCkge1xuICAgIHJlc3VsdFt1XSA9IHY7XG4gICAgdiA9IHBbdl07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuY29uc3QgaXNUZWxlcG9ydCA9ICh0eXBlKSA9PiB0eXBlLl9faXNUZWxlcG9ydDtcbmNvbnN0IGlzVGVsZXBvcnREaXNhYmxlZCA9IChwcm9wcykgPT4gcHJvcHMgJiYgKHByb3BzLmRpc2FibGVkIHx8IHByb3BzLmRpc2FibGVkID09PSBcIlwiKTtcbmNvbnN0IGlzVGFyZ2V0U1ZHID0gKHRhcmdldCkgPT4gdHlwZW9mIFNWR0VsZW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbmNvbnN0IHJlc29sdmVUYXJnZXQgPSAocHJvcHMsIHNlbGVjdCkgPT4ge1xuICBjb25zdCB0YXJnZXRTZWxlY3RvciA9IHByb3BzICYmIHByb3BzLnRvO1xuICBpZiAoaXNTdHJpbmcodGFyZ2V0U2VsZWN0b3IpKSB7XG4gICAgaWYgKCFzZWxlY3QpIHtcbiAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgICAgYEN1cnJlbnQgcmVuZGVyZXIgZG9lcyBub3Qgc3VwcG9ydCBzdHJpbmcgdGFyZ2V0IGZvciBUZWxlcG9ydHMuIChtaXNzaW5nIHF1ZXJ5U2VsZWN0b3IgcmVuZGVyZXIgb3B0aW9uKWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gc2VsZWN0KHRhcmdldFNlbGVjdG9yKTtcbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgICAgICBgRmFpbGVkIHRvIGxvY2F0ZSBUZWxlcG9ydCB0YXJnZXQgd2l0aCBzZWxlY3RvciBcIiR7dGFyZ2V0U2VsZWN0b3J9XCIuIE5vdGUgdGhlIHRhcmdldCBlbGVtZW50IG11c3QgZXhpc3QgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZCAtIGkuZS4gdGhlIHRhcmdldCBjYW5ub3QgYmUgcmVuZGVyZWQgYnkgdGhlIGNvbXBvbmVudCBpdHNlbGYsIGFuZCBpZGVhbGx5IHNob3VsZCBiZSBvdXRzaWRlIG9mIHRoZSBlbnRpcmUgVnVlIGNvbXBvbmVudCB0cmVlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICF0YXJnZXRTZWxlY3RvciAmJiAhaXNUZWxlcG9ydERpc2FibGVkKHByb3BzKSkge1xuICAgICAgd2FybihgSW52YWxpZCBUZWxlcG9ydCB0YXJnZXQ6ICR7dGFyZ2V0U2VsZWN0b3J9YCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRTZWxlY3RvcjtcbiAgfVxufTtcbmNvbnN0IFRlbGVwb3J0SW1wbCA9IHtcbiAgX19pc1RlbGVwb3J0OiB0cnVlLFxuICBwcm9jZXNzKG4xLCBuMiwgY29udGFpbmVyLCBhbmNob3IsIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UsIGlzU1ZHLCBzbG90U2NvcGVJZHMsIG9wdGltaXplZCwgaW50ZXJuYWxzKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWM6IG1vdW50Q2hpbGRyZW4sXG4gICAgICBwYzogcGF0Y2hDaGlsZHJlbixcbiAgICAgIHBiYzogcGF0Y2hCbG9ja0NoaWxkcmVuLFxuICAgICAgbzogeyBpbnNlcnQsIHF1ZXJ5U2VsZWN0b3IsIGNyZWF0ZVRleHQsIGNyZWF0ZUNvbW1lbnQgfVxuICAgIH0gPSBpbnRlcm5hbHM7XG4gICAgY29uc3QgZGlzYWJsZWQgPSBpc1RlbGVwb3J0RGlzYWJsZWQobjIucHJvcHMpO1xuICAgIGxldCB7IHNoYXBlRmxhZywgY2hpbGRyZW4sIGR5bmFtaWNDaGlsZHJlbiB9ID0gbjI7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgaXNIbXJVcGRhdGluZykge1xuICAgICAgb3B0aW1pemVkID0gZmFsc2U7XG4gICAgICBkeW5hbWljQ2hpbGRyZW4gPSBudWxsO1xuICAgIH1cbiAgICBpZiAobjEgPT0gbnVsbCkge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBuMi5lbCA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyBjcmVhdGVDb21tZW50KFwidGVsZXBvcnQgc3RhcnRcIikgOiBjcmVhdGVUZXh0KFwiXCIpO1xuICAgICAgY29uc3QgbWFpbkFuY2hvciA9IG4yLmFuY2hvciA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyBjcmVhdGVDb21tZW50KFwidGVsZXBvcnQgZW5kXCIpIDogY3JlYXRlVGV4dChcIlwiKTtcbiAgICAgIGluc2VydChwbGFjZWhvbGRlciwgY29udGFpbmVyLCBhbmNob3IpO1xuICAgICAgaW5zZXJ0KG1haW5BbmNob3IsIGNvbnRhaW5lciwgYW5jaG9yKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IG4yLnRhcmdldCA9IHJlc29sdmVUYXJnZXQobjIucHJvcHMsIHF1ZXJ5U2VsZWN0b3IpO1xuICAgICAgY29uc3QgdGFyZ2V0QW5jaG9yID0gbjIudGFyZ2V0QW5jaG9yID0gY3JlYXRlVGV4dChcIlwiKTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgaW5zZXJ0KHRhcmdldEFuY2hvciwgdGFyZ2V0KTtcbiAgICAgICAgaXNTVkcgPSBpc1NWRyB8fCBpc1RhcmdldFNWRyh0YXJnZXQpO1xuICAgICAgfSBlbHNlIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFkaXNhYmxlZCkge1xuICAgICAgICB3YXJuKFwiSW52YWxpZCBUZWxlcG9ydCB0YXJnZXQgb24gbW91bnQ6XCIsIHRhcmdldCwgYCgke3R5cGVvZiB0YXJnZXR9KWApO1xuICAgICAgfVxuICAgICAgY29uc3QgbW91bnQgPSAoY29udGFpbmVyMiwgYW5jaG9yMikgPT4ge1xuICAgICAgICBpZiAoc2hhcGVGbGFnICYgMTYpIHtcbiAgICAgICAgICBtb3VudENoaWxkcmVuKFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgICBjb250YWluZXIyLFxuICAgICAgICAgICAgYW5jaG9yMixcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgICBzbG90U2NvcGVJZHMsXG4gICAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgIG1vdW50KGNvbnRhaW5lciwgbWFpbkFuY2hvcik7XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldCkge1xuICAgICAgICBtb3VudCh0YXJnZXQsIHRhcmdldEFuY2hvcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG4yLmVsID0gbjEuZWw7XG4gICAgICBjb25zdCBtYWluQW5jaG9yID0gbjIuYW5jaG9yID0gbjEuYW5jaG9yO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gbjIudGFyZ2V0ID0gbjEudGFyZ2V0O1xuICAgICAgY29uc3QgdGFyZ2V0QW5jaG9yID0gbjIudGFyZ2V0QW5jaG9yID0gbjEudGFyZ2V0QW5jaG9yO1xuICAgICAgY29uc3Qgd2FzRGlzYWJsZWQgPSBpc1RlbGVwb3J0RGlzYWJsZWQobjEucHJvcHMpO1xuICAgICAgY29uc3QgY3VycmVudENvbnRhaW5lciA9IHdhc0Rpc2FibGVkID8gY29udGFpbmVyIDogdGFyZ2V0O1xuICAgICAgY29uc3QgY3VycmVudEFuY2hvciA9IHdhc0Rpc2FibGVkID8gbWFpbkFuY2hvciA6IHRhcmdldEFuY2hvcjtcbiAgICAgIGlzU1ZHID0gaXNTVkcgfHwgaXNUYXJnZXRTVkcodGFyZ2V0KTtcbiAgICAgIGlmIChkeW5hbWljQ2hpbGRyZW4pIHtcbiAgICAgICAgcGF0Y2hCbG9ja0NoaWxkcmVuKFxuICAgICAgICAgIG4xLmR5bmFtaWNDaGlsZHJlbixcbiAgICAgICAgICBkeW5hbWljQ2hpbGRyZW4sXG4gICAgICAgICAgY3VycmVudENvbnRhaW5lcixcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgc2xvdFNjb3BlSWRzXG4gICAgICAgICk7XG4gICAgICAgIHRyYXZlcnNlU3RhdGljQ2hpbGRyZW4objEsIG4yLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoIW9wdGltaXplZCkge1xuICAgICAgICBwYXRjaENoaWxkcmVuKFxuICAgICAgICAgIG4xLFxuICAgICAgICAgIG4yLFxuICAgICAgICAgIGN1cnJlbnRDb250YWluZXIsXG4gICAgICAgICAgY3VycmVudEFuY2hvcixcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgaXNTVkcsXG4gICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgaWYgKCF3YXNEaXNhYmxlZCkge1xuICAgICAgICAgIG1vdmVUZWxlcG9ydChcbiAgICAgICAgICAgIG4yLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgbWFpbkFuY2hvcixcbiAgICAgICAgICAgIGludGVybmFscyxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKG4yLnByb3BzICYmIG4yLnByb3BzLnRvKSAhPT0gKG4xLnByb3BzICYmIG4xLnByb3BzLnRvKSkge1xuICAgICAgICAgIGNvbnN0IG5leHRUYXJnZXQgPSBuMi50YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuICAgICAgICAgICAgbjIucHJvcHMsXG4gICAgICAgICAgICBxdWVyeVNlbGVjdG9yXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAobmV4dFRhcmdldCkge1xuICAgICAgICAgICAgbW92ZVRlbGVwb3J0KFxuICAgICAgICAgICAgICBuMixcbiAgICAgICAgICAgICAgbmV4dFRhcmdldCxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgaW50ZXJuYWxzLFxuICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgICAgICAgd2FybihcbiAgICAgICAgICAgICAgXCJJbnZhbGlkIFRlbGVwb3J0IHRhcmdldCBvbiB1cGRhdGU6XCIsXG4gICAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgICAgYCgke3R5cGVvZiB0YXJnZXR9KWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHdhc0Rpc2FibGVkKSB7XG4gICAgICAgICAgbW92ZVRlbGVwb3J0KFxuICAgICAgICAgICAgbjIsXG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICB0YXJnZXRBbmNob3IsXG4gICAgICAgICAgICBpbnRlcm5hbHMsXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVDc3NWYXJzKG4yKTtcbiAgfSxcbiAgcmVtb3ZlKHZub2RlLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCBvcHRpbWl6ZWQsIHsgdW06IHVubW91bnQsIG86IHsgcmVtb3ZlOiBob3N0UmVtb3ZlIH0gfSwgZG9SZW1vdmUpIHtcbiAgICBjb25zdCB7IHNoYXBlRmxhZywgY2hpbGRyZW4sIGFuY2hvciwgdGFyZ2V0QW5jaG9yLCB0YXJnZXQsIHByb3BzIH0gPSB2bm9kZTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBob3N0UmVtb3ZlKHRhcmdldEFuY2hvcik7XG4gICAgfVxuICAgIGlmIChkb1JlbW92ZSB8fCAhaXNUZWxlcG9ydERpc2FibGVkKHByb3BzKSkge1xuICAgICAgaG9zdFJlbW92ZShhbmNob3IpO1xuICAgICAgaWYgKHNoYXBlRmxhZyAmIDE2KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgIHVubW91bnQoXG4gICAgICAgICAgICBjaGlsZCxcbiAgICAgICAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICEhY2hpbGQuZHluYW1pY0NoaWxkcmVuXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbW92ZTogbW92ZVRlbGVwb3J0LFxuICBoeWRyYXRlOiBoeWRyYXRlVGVsZXBvcnRcbn07XG5mdW5jdGlvbiBtb3ZlVGVsZXBvcnQodm5vZGUsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yLCB7IG86IHsgaW5zZXJ0IH0sIG06IG1vdmUgfSwgbW92ZVR5cGUgPSAyKSB7XG4gIGlmIChtb3ZlVHlwZSA9PT0gMCkge1xuICAgIGluc2VydCh2bm9kZS50YXJnZXRBbmNob3IsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yKTtcbiAgfVxuICBjb25zdCB7IGVsLCBhbmNob3IsIHNoYXBlRmxhZywgY2hpbGRyZW4sIHByb3BzIH0gPSB2bm9kZTtcbiAgY29uc3QgaXNSZW9yZGVyID0gbW92ZVR5cGUgPT09IDI7XG4gIGlmIChpc1Jlb3JkZXIpIHtcbiAgICBpbnNlcnQoZWwsIGNvbnRhaW5lciwgcGFyZW50QW5jaG9yKTtcbiAgfVxuICBpZiAoIWlzUmVvcmRlciB8fCBpc1RlbGVwb3J0RGlzYWJsZWQocHJvcHMpKSB7XG4gICAgaWYgKHNoYXBlRmxhZyAmIDE2KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1vdmUoXG4gICAgICAgICAgY2hpbGRyZW5baV0sXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIHBhcmVudEFuY2hvcixcbiAgICAgICAgICAyXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChpc1Jlb3JkZXIpIHtcbiAgICBpbnNlcnQoYW5jaG9yLCBjb250YWluZXIsIHBhcmVudEFuY2hvcik7XG4gIH1cbn1cbmZ1bmN0aW9uIGh5ZHJhdGVUZWxlcG9ydChub2RlLCB2bm9kZSwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgc2xvdFNjb3BlSWRzLCBvcHRpbWl6ZWQsIHtcbiAgbzogeyBuZXh0U2libGluZywgcGFyZW50Tm9kZSwgcXVlcnlTZWxlY3RvciB9XG59LCBoeWRyYXRlQ2hpbGRyZW4pIHtcbiAgY29uc3QgdGFyZ2V0ID0gdm5vZGUudGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcbiAgICB2bm9kZS5wcm9wcyxcbiAgICBxdWVyeVNlbGVjdG9yXG4gICk7XG4gIGlmICh0YXJnZXQpIHtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gdGFyZ2V0Ll9scGEgfHwgdGFyZ2V0LmZpcnN0Q2hpbGQ7XG4gICAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDE2KSB7XG4gICAgICBpZiAoaXNUZWxlcG9ydERpc2FibGVkKHZub2RlLnByb3BzKSkge1xuICAgICAgICB2bm9kZS5hbmNob3IgPSBoeWRyYXRlQ2hpbGRyZW4oXG4gICAgICAgICAgbmV4dFNpYmxpbmcobm9kZSksXG4gICAgICAgICAgdm5vZGUsXG4gICAgICAgICAgcGFyZW50Tm9kZShub2RlKSxcbiAgICAgICAgICBwYXJlbnRDb21wb25lbnQsXG4gICAgICAgICAgcGFyZW50U3VzcGVuc2UsXG4gICAgICAgICAgc2xvdFNjb3BlSWRzLFxuICAgICAgICAgIG9wdGltaXplZFxuICAgICAgICApO1xuICAgICAgICB2bm9kZS50YXJnZXRBbmNob3IgPSB0YXJnZXROb2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdm5vZGUuYW5jaG9yID0gbmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICAgIGxldCB0YXJnZXRBbmNob3IgPSB0YXJnZXROb2RlO1xuICAgICAgICB3aGlsZSAodGFyZ2V0QW5jaG9yKSB7XG4gICAgICAgICAgdGFyZ2V0QW5jaG9yID0gbmV4dFNpYmxpbmcodGFyZ2V0QW5jaG9yKTtcbiAgICAgICAgICBpZiAodGFyZ2V0QW5jaG9yICYmIHRhcmdldEFuY2hvci5ub2RlVHlwZSA9PT0gOCAmJiB0YXJnZXRBbmNob3IuZGF0YSA9PT0gXCJ0ZWxlcG9ydCBhbmNob3JcIikge1xuICAgICAgICAgICAgdm5vZGUudGFyZ2V0QW5jaG9yID0gdGFyZ2V0QW5jaG9yO1xuICAgICAgICAgICAgdGFyZ2V0Ll9scGEgPSB2bm9kZS50YXJnZXRBbmNob3IgJiYgbmV4dFNpYmxpbmcodm5vZGUudGFyZ2V0QW5jaG9yKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBoeWRyYXRlQ2hpbGRyZW4oXG4gICAgICAgICAgdGFyZ2V0Tm9kZSxcbiAgICAgICAgICB2bm9kZSxcbiAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgcGFyZW50Q29tcG9uZW50LFxuICAgICAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgICAgIHNsb3RTY29wZUlkcyxcbiAgICAgICAgICBvcHRpbWl6ZWRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlQ3NzVmFycyh2bm9kZSk7XG4gIH1cbiAgcmV0dXJuIHZub2RlLmFuY2hvciAmJiBuZXh0U2libGluZyh2bm9kZS5hbmNob3IpO1xufVxuY29uc3QgVGVsZXBvcnQgPSBUZWxlcG9ydEltcGw7XG5mdW5jdGlvbiB1cGRhdGVDc3NWYXJzKHZub2RlKSB7XG4gIGNvbnN0IGN0eCA9IHZub2RlLmN0eDtcbiAgaWYgKGN0eCAmJiBjdHgudXQpIHtcbiAgICBsZXQgbm9kZSA9IHZub2RlLmNoaWxkcmVuWzBdLmVsO1xuICAgIHdoaWxlIChub2RlICE9PSB2bm9kZS50YXJnZXRBbmNob3IpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShcImRhdGEtdi1vd25lclwiLCBjdHgudWlkKTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICBjdHgudXQoKTtcbiAgfVxufVxuXG5jb25zdCBGcmFnbWVudCA9IFN5bWJvbC5mb3IoXCJ2LWZndFwiKTtcbmNvbnN0IFRleHQgPSBTeW1ib2wuZm9yKFwidi10eHRcIik7XG5jb25zdCBDb21tZW50ID0gU3ltYm9sLmZvcihcInYtY210XCIpO1xuY29uc3QgU3RhdGljID0gU3ltYm9sLmZvcihcInYtc3RjXCIpO1xuY29uc3QgYmxvY2tTdGFjayA9IFtdO1xubGV0IGN1cnJlbnRCbG9jayA9IG51bGw7XG5mdW5jdGlvbiBvcGVuQmxvY2soZGlzYWJsZVRyYWNraW5nID0gZmFsc2UpIHtcbiAgYmxvY2tTdGFjay5wdXNoKGN1cnJlbnRCbG9jayA9IGRpc2FibGVUcmFja2luZyA/IG51bGwgOiBbXSk7XG59XG5mdW5jdGlvbiBjbG9zZUJsb2NrKCkge1xuICBibG9ja1N0YWNrLnBvcCgpO1xuICBjdXJyZW50QmxvY2sgPSBibG9ja1N0YWNrW2Jsb2NrU3RhY2subGVuZ3RoIC0gMV0gfHwgbnVsbDtcbn1cbmxldCBpc0Jsb2NrVHJlZUVuYWJsZWQgPSAxO1xuZnVuY3Rpb24gc2V0QmxvY2tUcmFja2luZyh2YWx1ZSkge1xuICBpc0Jsb2NrVHJlZUVuYWJsZWQgKz0gdmFsdWU7XG59XG5mdW5jdGlvbiBzZXR1cEJsb2NrKHZub2RlKSB7XG4gIHZub2RlLmR5bmFtaWNDaGlsZHJlbiA9IGlzQmxvY2tUcmVlRW5hYmxlZCA+IDAgPyBjdXJyZW50QmxvY2sgfHwgRU1QVFlfQVJSIDogbnVsbDtcbiAgY2xvc2VCbG9jaygpO1xuICBpZiAoaXNCbG9ja1RyZWVFbmFibGVkID4gMCAmJiBjdXJyZW50QmxvY2spIHtcbiAgICBjdXJyZW50QmxvY2sucHVzaCh2bm9kZSk7XG4gIH1cbiAgcmV0dXJuIHZub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudEJsb2NrKHR5cGUsIHByb3BzLCBjaGlsZHJlbiwgcGF0Y2hGbGFnLCBkeW5hbWljUHJvcHMsIHNoYXBlRmxhZykge1xuICByZXR1cm4gc2V0dXBCbG9jayhcbiAgICBjcmVhdGVCYXNlVk5vZGUoXG4gICAgICB0eXBlLFxuICAgICAgcHJvcHMsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIHBhdGNoRmxhZyxcbiAgICAgIGR5bmFtaWNQcm9wcyxcbiAgICAgIHNoYXBlRmxhZyxcbiAgICAgIHRydWVcbiAgICAgIC8qIGlzQmxvY2sgKi9cbiAgICApXG4gICk7XG59XG5mdW5jdGlvbiBjcmVhdGVCbG9jayh0eXBlLCBwcm9wcywgY2hpbGRyZW4sIHBhdGNoRmxhZywgZHluYW1pY1Byb3BzKSB7XG4gIHJldHVybiBzZXR1cEJsb2NrKFxuICAgIGNyZWF0ZVZOb2RlKFxuICAgICAgdHlwZSxcbiAgICAgIHByb3BzLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICBwYXRjaEZsYWcsXG4gICAgICBkeW5hbWljUHJvcHMsXG4gICAgICB0cnVlXG4gICAgICAvKiBpc0Jsb2NrOiBwcmV2ZW50IGEgYmxvY2sgZnJvbSB0cmFja2luZyBpdHNlbGYgKi9cbiAgICApXG4gICk7XG59XG5mdW5jdGlvbiBpc1ZOb2RlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA/IHZhbHVlLl9fdl9pc1ZOb2RlID09PSB0cnVlIDogZmFsc2U7XG59XG5mdW5jdGlvbiBpc1NhbWVWTm9kZVR5cGUobjEsIG4yKSB7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIG4yLnNoYXBlRmxhZyAmIDYgJiYgaG1yRGlydHlDb21wb25lbnRzLmhhcyhuMi50eXBlKSkge1xuICAgIG4xLnNoYXBlRmxhZyAmPSB+MjU2O1xuICAgIG4yLnNoYXBlRmxhZyAmPSB+NTEyO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gbjEudHlwZSA9PT0gbjIudHlwZSAmJiBuMS5rZXkgPT09IG4yLmtleTtcbn1cbmxldCB2bm9kZUFyZ3NUcmFuc2Zvcm1lcjtcbmZ1bmN0aW9uIHRyYW5zZm9ybVZOb2RlQXJncyh0cmFuc2Zvcm1lcikge1xuICB2bm9kZUFyZ3NUcmFuc2Zvcm1lciA9IHRyYW5zZm9ybWVyO1xufVxuY29uc3QgY3JlYXRlVk5vZGVXaXRoQXJnc1RyYW5zZm9ybSA9ICguLi5hcmdzKSA9PiB7XG4gIHJldHVybiBfY3JlYXRlVk5vZGUoXG4gICAgLi4udm5vZGVBcmdzVHJhbnNmb3JtZXIgPyB2bm9kZUFyZ3NUcmFuc2Zvcm1lcihhcmdzLCBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UpIDogYXJnc1xuICApO1xufTtcbmNvbnN0IEludGVybmFsT2JqZWN0S2V5ID0gYF9fdkludGVybmFsYDtcbmNvbnN0IG5vcm1hbGl6ZUtleSA9ICh7IGtleSB9KSA9PiBrZXkgIT0gbnVsbCA/IGtleSA6IG51bGw7XG5jb25zdCBub3JtYWxpemVSZWYgPSAoe1xuICByZWYsXG4gIHJlZl9rZXksXG4gIHJlZl9mb3Jcbn0pID0+IHtcbiAgaWYgKHR5cGVvZiByZWYgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZWYgPSBcIlwiICsgcmVmO1xuICB9XG4gIHJldHVybiByZWYgIT0gbnVsbCA/IGlzU3RyaW5nKHJlZikgfHwgaXNSZWYocmVmKSB8fCBpc0Z1bmN0aW9uKHJlZikgPyB7IGk6IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSwgcjogcmVmLCBrOiByZWZfa2V5LCBmOiAhIXJlZl9mb3IgfSA6IHJlZiA6IG51bGw7XG59O1xuZnVuY3Rpb24gY3JlYXRlQmFzZVZOb2RlKHR5cGUsIHByb3BzID0gbnVsbCwgY2hpbGRyZW4gPSBudWxsLCBwYXRjaEZsYWcgPSAwLCBkeW5hbWljUHJvcHMgPSBudWxsLCBzaGFwZUZsYWcgPSB0eXBlID09PSBGcmFnbWVudCA/IDAgOiAxLCBpc0Jsb2NrTm9kZSA9IGZhbHNlLCBuZWVkRnVsbENoaWxkcmVuTm9ybWFsaXphdGlvbiA9IGZhbHNlKSB7XG4gIGNvbnN0IHZub2RlID0ge1xuICAgIF9fdl9pc1ZOb2RlOiB0cnVlLFxuICAgIF9fdl9za2lwOiB0cnVlLFxuICAgIHR5cGUsXG4gICAgcHJvcHMsXG4gICAga2V5OiBwcm9wcyAmJiBub3JtYWxpemVLZXkocHJvcHMpLFxuICAgIHJlZjogcHJvcHMgJiYgbm9ybWFsaXplUmVmKHByb3BzKSxcbiAgICBzY29wZUlkOiBjdXJyZW50U2NvcGVJZCxcbiAgICBzbG90U2NvcGVJZHM6IG51bGwsXG4gICAgY2hpbGRyZW4sXG4gICAgY29tcG9uZW50OiBudWxsLFxuICAgIHN1c3BlbnNlOiBudWxsLFxuICAgIHNzQ29udGVudDogbnVsbCxcbiAgICBzc0ZhbGxiYWNrOiBudWxsLFxuICAgIGRpcnM6IG51bGwsXG4gICAgdHJhbnNpdGlvbjogbnVsbCxcbiAgICBlbDogbnVsbCxcbiAgICBhbmNob3I6IG51bGwsXG4gICAgdGFyZ2V0OiBudWxsLFxuICAgIHRhcmdldEFuY2hvcjogbnVsbCxcbiAgICBzdGF0aWNDb3VudDogMCxcbiAgICBzaGFwZUZsYWcsXG4gICAgcGF0Y2hGbGFnLFxuICAgIGR5bmFtaWNQcm9wcyxcbiAgICBkeW5hbWljQ2hpbGRyZW46IG51bGwsXG4gICAgYXBwQ29udGV4dDogbnVsbCxcbiAgICBjdHg6IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZVxuICB9O1xuICBpZiAobmVlZEZ1bGxDaGlsZHJlbk5vcm1hbGl6YXRpb24pIHtcbiAgICBub3JtYWxpemVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4pO1xuICAgIGlmIChzaGFwZUZsYWcgJiAxMjgpIHtcbiAgICAgIHR5cGUubm9ybWFsaXplKHZub2RlKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2hpbGRyZW4pIHtcbiAgICB2bm9kZS5zaGFwZUZsYWcgfD0gaXNTdHJpbmcoY2hpbGRyZW4pID8gOCA6IDE2O1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHZub2RlLmtleSAhPT0gdm5vZGUua2V5KSB7XG4gICAgd2FybihgVk5vZGUgY3JlYXRlZCB3aXRoIGludmFsaWQga2V5IChOYU4pLiBWTm9kZSB0eXBlOmAsIHZub2RlLnR5cGUpO1xuICB9XG4gIGlmIChpc0Jsb2NrVHJlZUVuYWJsZWQgPiAwICYmIC8vIGF2b2lkIGEgYmxvY2sgbm9kZSBmcm9tIHRyYWNraW5nIGl0c2VsZlxuICAhaXNCbG9ja05vZGUgJiYgLy8gaGFzIGN1cnJlbnQgcGFyZW50IGJsb2NrXG4gIGN1cnJlbnRCbG9jayAmJiAvLyBwcmVzZW5jZSBvZiBhIHBhdGNoIGZsYWcgaW5kaWNhdGVzIHRoaXMgbm9kZSBuZWVkcyBwYXRjaGluZyBvbiB1cGRhdGVzLlxuICAvLyBjb21wb25lbnQgbm9kZXMgYWxzbyBzaG91bGQgYWx3YXlzIGJlIHBhdGNoZWQsIGJlY2F1c2UgZXZlbiBpZiB0aGVcbiAgLy8gY29tcG9uZW50IGRvZXNuJ3QgbmVlZCB0byB1cGRhdGUsIGl0IG5lZWRzIHRvIHBlcnNpc3QgdGhlIGluc3RhbmNlIG9uIHRvXG4gIC8vIHRoZSBuZXh0IHZub2RlIHNvIHRoYXQgaXQgY2FuIGJlIHByb3Blcmx5IHVubW91bnRlZCBsYXRlci5cbiAgKHZub2RlLnBhdGNoRmxhZyA+IDAgfHwgc2hhcGVGbGFnICYgNikgJiYgLy8gdGhlIEVWRU5UUyBmbGFnIGlzIG9ubHkgZm9yIGh5ZHJhdGlvbiBhbmQgaWYgaXQgaXMgdGhlIG9ubHkgZmxhZywgdGhlXG4gIC8vIHZub2RlIHNob3VsZCBub3QgYmUgY29uc2lkZXJlZCBkeW5hbWljIGR1ZSB0byBoYW5kbGVyIGNhY2hpbmcuXG4gIHZub2RlLnBhdGNoRmxhZyAhPT0gMzIpIHtcbiAgICBjdXJyZW50QmxvY2sucHVzaCh2bm9kZSk7XG4gIH1cbiAgcmV0dXJuIHZub2RlO1xufVxuY29uc3QgY3JlYXRlVk5vZGUgPSAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpID8gY3JlYXRlVk5vZGVXaXRoQXJnc1RyYW5zZm9ybSA6IF9jcmVhdGVWTm9kZTtcbmZ1bmN0aW9uIF9jcmVhdGVWTm9kZSh0eXBlLCBwcm9wcyA9IG51bGwsIGNoaWxkcmVuID0gbnVsbCwgcGF0Y2hGbGFnID0gMCwgZHluYW1pY1Byb3BzID0gbnVsbCwgaXNCbG9ja05vZGUgPSBmYWxzZSkge1xuICBpZiAoIXR5cGUgfHwgdHlwZSA9PT0gTlVMTF9EWU5BTUlDX0NPTVBPTkVOVCkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICF0eXBlKSB7XG4gICAgICB3YXJuKGBJbnZhbGlkIHZub2RlIHR5cGUgd2hlbiBjcmVhdGluZyB2bm9kZTogJHt0eXBlfS5gKTtcbiAgICB9XG4gICAgdHlwZSA9IENvbW1lbnQ7XG4gIH1cbiAgaWYgKGlzVk5vZGUodHlwZSkpIHtcbiAgICBjb25zdCBjbG9uZWQgPSBjbG9uZVZOb2RlKFxuICAgICAgdHlwZSxcbiAgICAgIHByb3BzLFxuICAgICAgdHJ1ZVxuICAgICAgLyogbWVyZ2VSZWY6IHRydWUgKi9cbiAgICApO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgbm9ybWFsaXplQ2hpbGRyZW4oY2xvbmVkLCBjaGlsZHJlbik7XG4gICAgfVxuICAgIGlmIChpc0Jsb2NrVHJlZUVuYWJsZWQgPiAwICYmICFpc0Jsb2NrTm9kZSAmJiBjdXJyZW50QmxvY2spIHtcbiAgICAgIGlmIChjbG9uZWQuc2hhcGVGbGFnICYgNikge1xuICAgICAgICBjdXJyZW50QmxvY2tbY3VycmVudEJsb2NrLmluZGV4T2YodHlwZSldID0gY2xvbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEJsb2NrLnB1c2goY2xvbmVkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2xvbmVkLnBhdGNoRmxhZyB8PSAtMjtcbiAgICByZXR1cm4gY2xvbmVkO1xuICB9XG4gIGlmIChpc0NsYXNzQ29tcG9uZW50KHR5cGUpKSB7XG4gICAgdHlwZSA9IHR5cGUuX192Y2NPcHRzO1xuICB9XG4gIGlmIChwcm9wcykge1xuICAgIHByb3BzID0gZ3VhcmRSZWFjdGl2ZVByb3BzKHByb3BzKTtcbiAgICBsZXQgeyBjbGFzczoga2xhc3MsIHN0eWxlIH0gPSBwcm9wcztcbiAgICBpZiAoa2xhc3MgJiYgIWlzU3RyaW5nKGtsYXNzKSkge1xuICAgICAgcHJvcHMuY2xhc3MgPSBub3JtYWxpemVDbGFzcyhrbGFzcyk7XG4gICAgfVxuICAgIGlmIChpc09iamVjdChzdHlsZSkpIHtcbiAgICAgIGlmIChpc1Byb3h5KHN0eWxlKSAmJiAhaXNBcnJheShzdHlsZSkpIHtcbiAgICAgICAgc3R5bGUgPSBleHRlbmQoe30sIHN0eWxlKTtcbiAgICAgIH1cbiAgICAgIHByb3BzLnN0eWxlID0gbm9ybWFsaXplU3R5bGUoc3R5bGUpO1xuICAgIH1cbiAgfVxuICBjb25zdCBzaGFwZUZsYWcgPSBpc1N0cmluZyh0eXBlKSA/IDEgOiBpc1N1c3BlbnNlKHR5cGUpID8gMTI4IDogaXNUZWxlcG9ydCh0eXBlKSA/IDY0IDogaXNPYmplY3QodHlwZSkgPyA0IDogaXNGdW5jdGlvbih0eXBlKSA/IDIgOiAwO1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBzaGFwZUZsYWcgJiA0ICYmIGlzUHJveHkodHlwZSkpIHtcbiAgICB0eXBlID0gdG9SYXcodHlwZSk7XG4gICAgd2FybihcbiAgICAgIGBWdWUgcmVjZWl2ZWQgYSBDb21wb25lbnQgd2hpY2ggd2FzIG1hZGUgYSByZWFjdGl2ZSBvYmplY3QuIFRoaXMgY2FuIGxlYWQgdG8gdW5uZWNlc3NhcnkgcGVyZm9ybWFuY2Ugb3ZlcmhlYWQsIGFuZCBzaG91bGQgYmUgYXZvaWRlZCBieSBtYXJraW5nIHRoZSBjb21wb25lbnQgd2l0aCBcXGBtYXJrUmF3XFxgIG9yIHVzaW5nIFxcYHNoYWxsb3dSZWZcXGAgaW5zdGVhZCBvZiBcXGByZWZcXGAuYCxcbiAgICAgIGBcbkNvbXBvbmVudCB0aGF0IHdhcyBtYWRlIHJlYWN0aXZlOiBgLFxuICAgICAgdHlwZVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJhc2VWTm9kZShcbiAgICB0eXBlLFxuICAgIHByb3BzLFxuICAgIGNoaWxkcmVuLFxuICAgIHBhdGNoRmxhZyxcbiAgICBkeW5hbWljUHJvcHMsXG4gICAgc2hhcGVGbGFnLFxuICAgIGlzQmxvY2tOb2RlLFxuICAgIHRydWVcbiAgKTtcbn1cbmZ1bmN0aW9uIGd1YXJkUmVhY3RpdmVQcm9wcyhwcm9wcykge1xuICBpZiAoIXByb3BzKVxuICAgIHJldHVybiBudWxsO1xuICByZXR1cm4gaXNQcm94eShwcm9wcykgfHwgSW50ZXJuYWxPYmplY3RLZXkgaW4gcHJvcHMgPyBleHRlbmQoe30sIHByb3BzKSA6IHByb3BzO1xufVxuZnVuY3Rpb24gY2xvbmVWTm9kZSh2bm9kZSwgZXh0cmFQcm9wcywgbWVyZ2VSZWYgPSBmYWxzZSkge1xuICBjb25zdCB7IHByb3BzLCByZWYsIHBhdGNoRmxhZywgY2hpbGRyZW4gfSA9IHZub2RlO1xuICBjb25zdCBtZXJnZWRQcm9wcyA9IGV4dHJhUHJvcHMgPyBtZXJnZVByb3BzKHByb3BzIHx8IHt9LCBleHRyYVByb3BzKSA6IHByb3BzO1xuICBjb25zdCBjbG9uZWQgPSB7XG4gICAgX192X2lzVk5vZGU6IHRydWUsXG4gICAgX192X3NraXA6IHRydWUsXG4gICAgdHlwZTogdm5vZGUudHlwZSxcbiAgICBwcm9wczogbWVyZ2VkUHJvcHMsXG4gICAga2V5OiBtZXJnZWRQcm9wcyAmJiBub3JtYWxpemVLZXkobWVyZ2VkUHJvcHMpLFxuICAgIHJlZjogZXh0cmFQcm9wcyAmJiBleHRyYVByb3BzLnJlZiA/IChcbiAgICAgIC8vICMyMDc4IGluIHRoZSBjYXNlIG9mIDxjb21wb25lbnQgOmlzPVwidm5vZGVcIiByZWY9XCJleHRyYVwiLz5cbiAgICAgIC8vIGlmIHRoZSB2bm9kZSBpdHNlbGYgYWxyZWFkeSBoYXMgYSByZWYsIGNsb25lVk5vZGUgd2lsbCBuZWVkIHRvIG1lcmdlXG4gICAgICAvLyB0aGUgcmVmcyBzbyB0aGUgc2luZ2xlIHZub2RlIGNhbiBiZSBzZXQgb24gbXVsdGlwbGUgcmVmc1xuICAgICAgbWVyZ2VSZWYgJiYgcmVmID8gaXNBcnJheShyZWYpID8gcmVmLmNvbmNhdChub3JtYWxpemVSZWYoZXh0cmFQcm9wcykpIDogW3JlZiwgbm9ybWFsaXplUmVmKGV4dHJhUHJvcHMpXSA6IG5vcm1hbGl6ZVJlZihleHRyYVByb3BzKVxuICAgICkgOiByZWYsXG4gICAgc2NvcGVJZDogdm5vZGUuc2NvcGVJZCxcbiAgICBzbG90U2NvcGVJZHM6IHZub2RlLnNsb3RTY29wZUlkcyxcbiAgICBjaGlsZHJlbjogISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiBwYXRjaEZsYWcgPT09IC0xICYmIGlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4ubWFwKGRlZXBDbG9uZVZOb2RlKSA6IGNoaWxkcmVuLFxuICAgIHRhcmdldDogdm5vZGUudGFyZ2V0LFxuICAgIHRhcmdldEFuY2hvcjogdm5vZGUudGFyZ2V0QW5jaG9yLFxuICAgIHN0YXRpY0NvdW50OiB2bm9kZS5zdGF0aWNDb3VudCxcbiAgICBzaGFwZUZsYWc6IHZub2RlLnNoYXBlRmxhZyxcbiAgICAvLyBpZiB0aGUgdm5vZGUgaXMgY2xvbmVkIHdpdGggZXh0cmEgcHJvcHMsIHdlIGNhbiBubyBsb25nZXIgYXNzdW1lIGl0c1xuICAgIC8vIGV4aXN0aW5nIHBhdGNoIGZsYWcgdG8gYmUgcmVsaWFibGUgYW5kIG5lZWQgdG8gYWRkIHRoZSBGVUxMX1BST1BTIGZsYWcuXG4gICAgLy8gbm90ZTogcHJlc2VydmUgZmxhZyBmb3IgZnJhZ21lbnRzIHNpbmNlIHRoZXkgdXNlIHRoZSBmbGFnIGZvciBjaGlsZHJlblxuICAgIC8vIGZhc3QgcGF0aHMgb25seS5cbiAgICBwYXRjaEZsYWc6IGV4dHJhUHJvcHMgJiYgdm5vZGUudHlwZSAhPT0gRnJhZ21lbnQgPyBwYXRjaEZsYWcgPT09IC0xID8gMTYgOiBwYXRjaEZsYWcgfCAxNiA6IHBhdGNoRmxhZyxcbiAgICBkeW5hbWljUHJvcHM6IHZub2RlLmR5bmFtaWNQcm9wcyxcbiAgICBkeW5hbWljQ2hpbGRyZW46IHZub2RlLmR5bmFtaWNDaGlsZHJlbixcbiAgICBhcHBDb250ZXh0OiB2bm9kZS5hcHBDb250ZXh0LFxuICAgIGRpcnM6IHZub2RlLmRpcnMsXG4gICAgdHJhbnNpdGlvbjogdm5vZGUudHJhbnNpdGlvbixcbiAgICAvLyBUaGVzZSBzaG91bGQgdGVjaG5pY2FsbHkgb25seSBiZSBub24tbnVsbCBvbiBtb3VudGVkIFZOb2Rlcy4gSG93ZXZlcixcbiAgICAvLyB0aGV5ICpzaG91bGQqIGJlIGNvcGllZCBmb3Iga2VwdC1hbGl2ZSB2bm9kZXMuIFNvIHdlIGp1c3QgYWx3YXlzIGNvcHlcbiAgICAvLyB0aGVtIHNpbmNlIHRoZW0gYmVpbmcgbm9uLW51bGwgZHVyaW5nIGEgbW91bnQgZG9lc24ndCBhZmZlY3QgdGhlIGxvZ2ljIGFzXG4gICAgLy8gdGhleSB3aWxsIHNpbXBseSBiZSBvdmVyd3JpdHRlbi5cbiAgICBjb21wb25lbnQ6IHZub2RlLmNvbXBvbmVudCxcbiAgICBzdXNwZW5zZTogdm5vZGUuc3VzcGVuc2UsXG4gICAgc3NDb250ZW50OiB2bm9kZS5zc0NvbnRlbnQgJiYgY2xvbmVWTm9kZSh2bm9kZS5zc0NvbnRlbnQpLFxuICAgIHNzRmFsbGJhY2s6IHZub2RlLnNzRmFsbGJhY2sgJiYgY2xvbmVWTm9kZSh2bm9kZS5zc0ZhbGxiYWNrKSxcbiAgICBlbDogdm5vZGUuZWwsXG4gICAgYW5jaG9yOiB2bm9kZS5hbmNob3IsXG4gICAgY3R4OiB2bm9kZS5jdHgsXG4gICAgY2U6IHZub2RlLmNlXG4gIH07XG4gIHJldHVybiBjbG9uZWQ7XG59XG5mdW5jdGlvbiBkZWVwQ2xvbmVWTm9kZSh2bm9kZSkge1xuICBjb25zdCBjbG9uZWQgPSBjbG9uZVZOb2RlKHZub2RlKTtcbiAgaWYgKGlzQXJyYXkodm5vZGUuY2hpbGRyZW4pKSB7XG4gICAgY2xvbmVkLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW4ubWFwKGRlZXBDbG9uZVZOb2RlKTtcbiAgfVxuICByZXR1cm4gY2xvbmVkO1xufVxuZnVuY3Rpb24gY3JlYXRlVGV4dFZOb2RlKHRleHQgPSBcIiBcIiwgZmxhZyA9IDApIHtcbiAgcmV0dXJuIGNyZWF0ZVZOb2RlKFRleHQsIG51bGwsIHRleHQsIGZsYWcpO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RhdGljVk5vZGUoY29udGVudCwgbnVtYmVyT2ZOb2Rlcykge1xuICBjb25zdCB2bm9kZSA9IGNyZWF0ZVZOb2RlKFN0YXRpYywgbnVsbCwgY29udGVudCk7XG4gIHZub2RlLnN0YXRpY0NvdW50ID0gbnVtYmVyT2ZOb2RlcztcbiAgcmV0dXJuIHZub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlQ29tbWVudFZOb2RlKHRleHQgPSBcIlwiLCBhc0Jsb2NrID0gZmFsc2UpIHtcbiAgcmV0dXJuIGFzQmxvY2sgPyAob3BlbkJsb2NrKCksIGNyZWF0ZUJsb2NrKENvbW1lbnQsIG51bGwsIHRleHQpKSA6IGNyZWF0ZVZOb2RlKENvbW1lbnQsIG51bGwsIHRleHQpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplVk5vZGUoY2hpbGQpIHtcbiAgaWYgKGNoaWxkID09IG51bGwgfHwgdHlwZW9mIGNoaWxkID09PSBcImJvb2xlYW5cIikge1xuICAgIHJldHVybiBjcmVhdGVWTm9kZShDb21tZW50KTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KGNoaWxkKSkge1xuICAgIHJldHVybiBjcmVhdGVWTm9kZShcbiAgICAgIEZyYWdtZW50LFxuICAgICAgbnVsbCxcbiAgICAgIC8vICMzNjY2LCBhdm9pZCByZWZlcmVuY2UgcG9sbHV0aW9uIHdoZW4gcmV1c2luZyB2bm9kZVxuICAgICAgY2hpbGQuc2xpY2UoKVxuICAgICk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIGNsb25lSWZNb3VudGVkKGNoaWxkKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY3JlYXRlVk5vZGUoVGV4dCwgbnVsbCwgU3RyaW5nKGNoaWxkKSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGNsb25lSWZNb3VudGVkKGNoaWxkKSB7XG4gIHJldHVybiBjaGlsZC5lbCA9PT0gbnVsbCAmJiBjaGlsZC5wYXRjaEZsYWcgIT09IC0xIHx8IGNoaWxkLm1lbW8gPyBjaGlsZCA6IGNsb25lVk5vZGUoY2hpbGQpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4odm5vZGUsIGNoaWxkcmVuKSB7XG4gIGxldCB0eXBlID0gMDtcbiAgY29uc3QgeyBzaGFwZUZsYWcgfSA9IHZub2RlO1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfSBlbHNlIGlmIChpc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIHR5cGUgPSAxNjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgY2hpbGRyZW4gPT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAoc2hhcGVGbGFnICYgKDEgfCA2NCkpIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBjaGlsZHJlbi5kZWZhdWx0O1xuICAgICAgaWYgKHNsb3QpIHtcbiAgICAgICAgc2xvdC5fYyAmJiAoc2xvdC5fZCA9IGZhbHNlKTtcbiAgICAgICAgbm9ybWFsaXplQ2hpbGRyZW4odm5vZGUsIHNsb3QoKSk7XG4gICAgICAgIHNsb3QuX2MgJiYgKHNsb3QuX2QgPSB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZSA9IDMyO1xuICAgICAgY29uc3Qgc2xvdEZsYWcgPSBjaGlsZHJlbi5fO1xuICAgICAgaWYgKCFzbG90RmxhZyAmJiAhKEludGVybmFsT2JqZWN0S2V5IGluIGNoaWxkcmVuKSkge1xuICAgICAgICBjaGlsZHJlbi5fY3R4ID0gY3VycmVudFJlbmRlcmluZ0luc3RhbmNlO1xuICAgICAgfSBlbHNlIGlmIChzbG90RmxhZyA9PT0gMyAmJiBjdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZS5zbG90cy5fID09PSAxKSB7XG4gICAgICAgICAgY2hpbGRyZW4uXyA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hpbGRyZW4uXyA9IDI7XG4gICAgICAgICAgdm5vZGUucGF0Y2hGbGFnIHw9IDEwMjQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihjaGlsZHJlbikpIHtcbiAgICBjaGlsZHJlbiA9IHsgZGVmYXVsdDogY2hpbGRyZW4sIF9jdHg6IGN1cnJlbnRSZW5kZXJpbmdJbnN0YW5jZSB9O1xuICAgIHR5cGUgPSAzMjtcbiAgfSBlbHNlIHtcbiAgICBjaGlsZHJlbiA9IFN0cmluZyhjaGlsZHJlbik7XG4gICAgaWYgKHNoYXBlRmxhZyAmIDY0KSB7XG4gICAgICB0eXBlID0gMTY7XG4gICAgICBjaGlsZHJlbiA9IFtjcmVhdGVUZXh0Vk5vZGUoY2hpbGRyZW4pXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZSA9IDg7XG4gICAgfVxuICB9XG4gIHZub2RlLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIHZub2RlLnNoYXBlRmxhZyB8PSB0eXBlO1xufVxuZnVuY3Rpb24gbWVyZ2VQcm9wcyguLi5hcmdzKSB7XG4gIGNvbnN0IHJldCA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB0b01lcmdlID0gYXJnc1tpXTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b01lcmdlKSB7XG4gICAgICBpZiAoa2V5ID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgaWYgKHJldC5jbGFzcyAhPT0gdG9NZXJnZS5jbGFzcykge1xuICAgICAgICAgIHJldC5jbGFzcyA9IG5vcm1hbGl6ZUNsYXNzKFtyZXQuY2xhc3MsIHRvTWVyZ2UuY2xhc3NdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic3R5bGVcIikge1xuICAgICAgICByZXQuc3R5bGUgPSBub3JtYWxpemVTdHlsZShbcmV0LnN0eWxlLCB0b01lcmdlLnN0eWxlXSk7XG4gICAgICB9IGVsc2UgaWYgKGlzT24oa2V5KSkge1xuICAgICAgICBjb25zdCBleGlzdGluZyA9IHJldFtrZXldO1xuICAgICAgICBjb25zdCBpbmNvbWluZyA9IHRvTWVyZ2Vba2V5XTtcbiAgICAgICAgaWYgKGluY29taW5nICYmIGV4aXN0aW5nICE9PSBpbmNvbWluZyAmJiAhKGlzQXJyYXkoZXhpc3RpbmcpICYmIGV4aXN0aW5nLmluY2x1ZGVzKGluY29taW5nKSkpIHtcbiAgICAgICAgICByZXRba2V5XSA9IGV4aXN0aW5nID8gW10uY29uY2F0KGV4aXN0aW5nLCBpbmNvbWluZykgOiBpbmNvbWluZztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChrZXkgIT09IFwiXCIpIHtcbiAgICAgICAgcmV0W2tleV0gPSB0b01lcmdlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBpbnZva2VWTm9kZUhvb2soaG9vaywgaW5zdGFuY2UsIHZub2RlLCBwcmV2Vk5vZGUgPSBudWxsKSB7XG4gIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nKGhvb2ssIGluc3RhbmNlLCA3LCBbXG4gICAgdm5vZGUsXG4gICAgcHJldlZOb2RlXG4gIF0pO1xufVxuXG5jb25zdCBlbXB0eUFwcENvbnRleHQgPSBjcmVhdGVBcHBDb250ZXh0KCk7XG5sZXQgdWlkID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlKHZub2RlLCBwYXJlbnQsIHN1c3BlbnNlKSB7XG4gIGNvbnN0IHR5cGUgPSB2bm9kZS50eXBlO1xuICBjb25zdCBhcHBDb250ZXh0ID0gKHBhcmVudCA/IHBhcmVudC5hcHBDb250ZXh0IDogdm5vZGUuYXBwQ29udGV4dCkgfHwgZW1wdHlBcHBDb250ZXh0O1xuICBjb25zdCBpbnN0YW5jZSA9IHtcbiAgICB1aWQ6IHVpZCsrLFxuICAgIHZub2RlLFxuICAgIHR5cGUsXG4gICAgcGFyZW50LFxuICAgIGFwcENvbnRleHQsXG4gICAgcm9vdDogbnVsbCxcbiAgICAvLyB0byBiZSBpbW1lZGlhdGVseSBzZXRcbiAgICBuZXh0OiBudWxsLFxuICAgIHN1YlRyZWU6IG51bGwsXG4gICAgLy8gd2lsbCBiZSBzZXQgc3luY2hyb25vdXNseSByaWdodCBhZnRlciBjcmVhdGlvblxuICAgIGVmZmVjdDogbnVsbCxcbiAgICB1cGRhdGU6IG51bGwsXG4gICAgLy8gd2lsbCBiZSBzZXQgc3luY2hyb25vdXNseSByaWdodCBhZnRlciBjcmVhdGlvblxuICAgIHNjb3BlOiBuZXcgRWZmZWN0U2NvcGUoXG4gICAgICB0cnVlXG4gICAgICAvKiBkZXRhY2hlZCAqL1xuICAgICksXG4gICAgcmVuZGVyOiBudWxsLFxuICAgIHByb3h5OiBudWxsLFxuICAgIGV4cG9zZWQ6IG51bGwsXG4gICAgZXhwb3NlUHJveHk6IG51bGwsXG4gICAgd2l0aFByb3h5OiBudWxsLFxuICAgIHByb3ZpZGVzOiBwYXJlbnQgPyBwYXJlbnQucHJvdmlkZXMgOiBPYmplY3QuY3JlYXRlKGFwcENvbnRleHQucHJvdmlkZXMpLFxuICAgIGFjY2Vzc0NhY2hlOiBudWxsLFxuICAgIHJlbmRlckNhY2hlOiBbXSxcbiAgICAvLyBsb2NhbCByZXNvbHZlZCBhc3NldHNcbiAgICBjb21wb25lbnRzOiBudWxsLFxuICAgIGRpcmVjdGl2ZXM6IG51bGwsXG4gICAgLy8gcmVzb2x2ZWQgcHJvcHMgYW5kIGVtaXRzIG9wdGlvbnNcbiAgICBwcm9wc09wdGlvbnM6IG5vcm1hbGl6ZVByb3BzT3B0aW9ucyh0eXBlLCBhcHBDb250ZXh0KSxcbiAgICBlbWl0c09wdGlvbnM6IG5vcm1hbGl6ZUVtaXRzT3B0aW9ucyh0eXBlLCBhcHBDb250ZXh0KSxcbiAgICAvLyBlbWl0XG4gICAgZW1pdDogbnVsbCxcbiAgICAvLyB0byBiZSBzZXQgaW1tZWRpYXRlbHlcbiAgICBlbWl0dGVkOiBudWxsLFxuICAgIC8vIHByb3BzIGRlZmF1bHQgdmFsdWVcbiAgICBwcm9wc0RlZmF1bHRzOiBFTVBUWV9PQkosXG4gICAgLy8gaW5oZXJpdEF0dHJzXG4gICAgaW5oZXJpdEF0dHJzOiB0eXBlLmluaGVyaXRBdHRycyxcbiAgICAvLyBzdGF0ZVxuICAgIGN0eDogRU1QVFlfT0JKLFxuICAgIGRhdGE6IEVNUFRZX09CSixcbiAgICBwcm9wczogRU1QVFlfT0JKLFxuICAgIGF0dHJzOiBFTVBUWV9PQkosXG4gICAgc2xvdHM6IEVNUFRZX09CSixcbiAgICByZWZzOiBFTVBUWV9PQkosXG4gICAgc2V0dXBTdGF0ZTogRU1QVFlfT0JKLFxuICAgIHNldHVwQ29udGV4dDogbnVsbCxcbiAgICBhdHRyc1Byb3h5OiBudWxsLFxuICAgIHNsb3RzUHJveHk6IG51bGwsXG4gICAgLy8gc3VzcGVuc2UgcmVsYXRlZFxuICAgIHN1c3BlbnNlLFxuICAgIHN1c3BlbnNlSWQ6IHN1c3BlbnNlID8gc3VzcGVuc2UucGVuZGluZ0lkIDogMCxcbiAgICBhc3luY0RlcDogbnVsbCxcbiAgICBhc3luY1Jlc29sdmVkOiBmYWxzZSxcbiAgICAvLyBsaWZlY3ljbGUgaG9va3NcbiAgICAvLyBub3QgdXNpbmcgZW51bXMgaGVyZSBiZWNhdXNlIGl0IHJlc3VsdHMgaW4gY29tcHV0ZWQgcHJvcGVydGllc1xuICAgIGlzTW91bnRlZDogZmFsc2UsXG4gICAgaXNVbm1vdW50ZWQ6IGZhbHNlLFxuICAgIGlzRGVhY3RpdmF0ZWQ6IGZhbHNlLFxuICAgIGJjOiBudWxsLFxuICAgIGM6IG51bGwsXG4gICAgYm06IG51bGwsXG4gICAgbTogbnVsbCxcbiAgICBidTogbnVsbCxcbiAgICB1OiBudWxsLFxuICAgIHVtOiBudWxsLFxuICAgIGJ1bTogbnVsbCxcbiAgICBkYTogbnVsbCxcbiAgICBhOiBudWxsLFxuICAgIHJ0ZzogbnVsbCxcbiAgICBydGM6IG51bGwsXG4gICAgZWM6IG51bGwsXG4gICAgc3A6IG51bGxcbiAgfTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICBpbnN0YW5jZS5jdHggPSBjcmVhdGVEZXZSZW5kZXJDb250ZXh0KGluc3RhbmNlKTtcbiAgfSBlbHNlIHtcbiAgICBpbnN0YW5jZS5jdHggPSB7IF86IGluc3RhbmNlIH07XG4gIH1cbiAgaW5zdGFuY2Uucm9vdCA9IHBhcmVudCA/IHBhcmVudC5yb290IDogaW5zdGFuY2U7XG4gIGluc3RhbmNlLmVtaXQgPSBlbWl0LmJpbmQobnVsbCwgaW5zdGFuY2UpO1xuICBpZiAodm5vZGUuY2UpIHtcbiAgICB2bm9kZS5jZShpbnN0YW5jZSk7XG4gIH1cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxubGV0IGN1cnJlbnRJbnN0YW5jZSA9IG51bGw7XG5jb25zdCBnZXRDdXJyZW50SW5zdGFuY2UgPSAoKSA9PiBjdXJyZW50SW5zdGFuY2UgfHwgY3VycmVudFJlbmRlcmluZ0luc3RhbmNlO1xubGV0IGludGVybmFsU2V0Q3VycmVudEluc3RhbmNlO1xubGV0IGdsb2JhbEN1cnJlbnRJbnN0YW5jZVNldHRlcnM7XG5sZXQgc2V0dGVyc0tleSA9IFwiX19WVUVfSU5TVEFOQ0VfU0VUVEVSU19fXCI7XG57XG4gIGlmICghKGdsb2JhbEN1cnJlbnRJbnN0YW5jZVNldHRlcnMgPSBnZXRHbG9iYWxUaGlzKClbc2V0dGVyc0tleV0pKSB7XG4gICAgZ2xvYmFsQ3VycmVudEluc3RhbmNlU2V0dGVycyA9IGdldEdsb2JhbFRoaXMoKVtzZXR0ZXJzS2V5XSA9IFtdO1xuICB9XG4gIGdsb2JhbEN1cnJlbnRJbnN0YW5jZVNldHRlcnMucHVzaCgoaSkgPT4gY3VycmVudEluc3RhbmNlID0gaSk7XG4gIGludGVybmFsU2V0Q3VycmVudEluc3RhbmNlID0gKGluc3RhbmNlKSA9PiB7XG4gICAgaWYgKGdsb2JhbEN1cnJlbnRJbnN0YW5jZVNldHRlcnMubGVuZ3RoID4gMSkge1xuICAgICAgZ2xvYmFsQ3VycmVudEluc3RhbmNlU2V0dGVycy5mb3JFYWNoKChzKSA9PiBzKGluc3RhbmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbEN1cnJlbnRJbnN0YW5jZVNldHRlcnNbMF0oaW5zdGFuY2UpO1xuICAgIH1cbiAgfTtcbn1cbmNvbnN0IHNldEN1cnJlbnRJbnN0YW5jZSA9IChpbnN0YW5jZSkgPT4ge1xuICBpbnRlcm5hbFNldEN1cnJlbnRJbnN0YW5jZShpbnN0YW5jZSk7XG4gIGluc3RhbmNlLnNjb3BlLm9uKCk7XG59O1xuY29uc3QgdW5zZXRDdXJyZW50SW5zdGFuY2UgPSAoKSA9PiB7XG4gIGN1cnJlbnRJbnN0YW5jZSAmJiBjdXJyZW50SW5zdGFuY2Uuc2NvcGUub2ZmKCk7XG4gIGludGVybmFsU2V0Q3VycmVudEluc3RhbmNlKG51bGwpO1xufTtcbmNvbnN0IGlzQnVpbHRJblRhZyA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKFwic2xvdCxjb21wb25lbnRcIik7XG5mdW5jdGlvbiB2YWxpZGF0ZUNvbXBvbmVudE5hbWUobmFtZSwgY29uZmlnKSB7XG4gIGNvbnN0IGFwcElzTmF0aXZlVGFnID0gY29uZmlnLmlzTmF0aXZlVGFnIHx8IE5PO1xuICBpZiAoaXNCdWlsdEluVGFnKG5hbWUpIHx8IGFwcElzTmF0aXZlVGFnKG5hbWUpKSB7XG4gICAgd2FybihcbiAgICAgIFwiRG8gbm90IHVzZSBidWlsdC1pbiBvciByZXNlcnZlZCBIVE1MIGVsZW1lbnRzIGFzIGNvbXBvbmVudCBpZDogXCIgKyBuYW1lXG4gICAgKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTdGF0ZWZ1bENvbXBvbmVudChpbnN0YW5jZSkge1xuICByZXR1cm4gaW5zdGFuY2Uudm5vZGUuc2hhcGVGbGFnICYgNDtcbn1cbmxldCBpc0luU1NSQ29tcG9uZW50U2V0dXAgPSBmYWxzZTtcbmZ1bmN0aW9uIHNldHVwQ29tcG9uZW50KGluc3RhbmNlLCBpc1NTUiA9IGZhbHNlKSB7XG4gIGlzSW5TU1JDb21wb25lbnRTZXR1cCA9IGlzU1NSO1xuICBjb25zdCB7IHByb3BzLCBjaGlsZHJlbiB9ID0gaW5zdGFuY2Uudm5vZGU7XG4gIGNvbnN0IGlzU3RhdGVmdWwgPSBpc1N0YXRlZnVsQ29tcG9uZW50KGluc3RhbmNlKTtcbiAgaW5pdFByb3BzKGluc3RhbmNlLCBwcm9wcywgaXNTdGF0ZWZ1bCwgaXNTU1IpO1xuICBpbml0U2xvdHMoaW5zdGFuY2UsIGNoaWxkcmVuKTtcbiAgY29uc3Qgc2V0dXBSZXN1bHQgPSBpc1N0YXRlZnVsID8gc2V0dXBTdGF0ZWZ1bENvbXBvbmVudChpbnN0YW5jZSwgaXNTU1IpIDogdm9pZCAwO1xuICBpc0luU1NSQ29tcG9uZW50U2V0dXAgPSBmYWxzZTtcbiAgcmV0dXJuIHNldHVwUmVzdWx0O1xufVxuZnVuY3Rpb24gc2V0dXBTdGF0ZWZ1bENvbXBvbmVudChpbnN0YW5jZSwgaXNTU1IpIHtcbiAgdmFyIF9hO1xuICBjb25zdCBDb21wb25lbnQgPSBpbnN0YW5jZS50eXBlO1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIGlmIChDb21wb25lbnQubmFtZSkge1xuICAgICAgdmFsaWRhdGVDb21wb25lbnROYW1lKENvbXBvbmVudC5uYW1lLCBpbnN0YW5jZS5hcHBDb250ZXh0LmNvbmZpZyk7XG4gICAgfVxuICAgIGlmIChDb21wb25lbnQuY29tcG9uZW50cykge1xuICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhDb21wb25lbnQuY29tcG9uZW50cyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbGlkYXRlQ29tcG9uZW50TmFtZShuYW1lc1tpXSwgaW5zdGFuY2UuYXBwQ29udGV4dC5jb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoQ29tcG9uZW50LmRpcmVjdGl2ZXMpIHtcbiAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMoQ29tcG9uZW50LmRpcmVjdGl2ZXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YWxpZGF0ZURpcmVjdGl2ZU5hbWUobmFtZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoQ29tcG9uZW50LmNvbXBpbGVyT3B0aW9ucyAmJiBpc1J1bnRpbWVPbmx5KCkpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBcImNvbXBpbGVyT3B0aW9uc1wiIGlzIG9ubHkgc3VwcG9ydGVkIHdoZW4gdXNpbmcgYSBidWlsZCBvZiBWdWUgdGhhdCBpbmNsdWRlcyB0aGUgcnVudGltZSBjb21waWxlci4gU2luY2UgeW91IGFyZSB1c2luZyBhIHJ1bnRpbWUtb25seSBidWlsZCwgdGhlIG9wdGlvbnMgc2hvdWxkIGJlIHBhc3NlZCB2aWEgeW91ciBidWlsZCB0b29sIGNvbmZpZyBpbnN0ZWFkLmBcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIGluc3RhbmNlLmFjY2Vzc0NhY2hlID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGluc3RhbmNlLnByb3h5ID0gbWFya1JhdyhuZXcgUHJveHkoaW5zdGFuY2UuY3R4LCBQdWJsaWNJbnN0YW5jZVByb3h5SGFuZGxlcnMpKTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICBleHBvc2VQcm9wc09uUmVuZGVyQ29udGV4dChpbnN0YW5jZSk7XG4gIH1cbiAgY29uc3QgeyBzZXR1cCB9ID0gQ29tcG9uZW50O1xuICBpZiAoc2V0dXApIHtcbiAgICBjb25zdCBzZXR1cENvbnRleHQgPSBpbnN0YW5jZS5zZXR1cENvbnRleHQgPSBzZXR1cC5sZW5ndGggPiAxID8gY3JlYXRlU2V0dXBDb250ZXh0KGluc3RhbmNlKSA6IG51bGw7XG4gICAgc2V0Q3VycmVudEluc3RhbmNlKGluc3RhbmNlKTtcbiAgICBwYXVzZVRyYWNraW5nKCk7XG4gICAgY29uc3Qgc2V0dXBSZXN1bHQgPSBjYWxsV2l0aEVycm9ySGFuZGxpbmcoXG4gICAgICBzZXR1cCxcbiAgICAgIGluc3RhbmNlLFxuICAgICAgMCxcbiAgICAgIFshIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpID8gc2hhbGxvd1JlYWRvbmx5KGluc3RhbmNlLnByb3BzKSA6IGluc3RhbmNlLnByb3BzLCBzZXR1cENvbnRleHRdXG4gICAgKTtcbiAgICByZXNldFRyYWNraW5nKCk7XG4gICAgdW5zZXRDdXJyZW50SW5zdGFuY2UoKTtcbiAgICBpZiAoaXNQcm9taXNlKHNldHVwUmVzdWx0KSkge1xuICAgICAgc2V0dXBSZXN1bHQudGhlbih1bnNldEN1cnJlbnRJbnN0YW5jZSwgdW5zZXRDdXJyZW50SW5zdGFuY2UpO1xuICAgICAgaWYgKGlzU1NSKSB7XG4gICAgICAgIHJldHVybiBzZXR1cFJlc3VsdC50aGVuKChyZXNvbHZlZFJlc3VsdCkgPT4ge1xuICAgICAgICAgIGhhbmRsZVNldHVwUmVzdWx0KGluc3RhbmNlLCByZXNvbHZlZFJlc3VsdCwgaXNTU1IpO1xuICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGhhbmRsZUVycm9yKGUsIGluc3RhbmNlLCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZS5hc3luY0RlcCA9IHNldHVwUmVzdWx0O1xuICAgICAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhaW5zdGFuY2Uuc3VzcGVuc2UpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gKF9hID0gQ29tcG9uZW50Lm5hbWUpICE9IG51bGwgPyBfYSA6IFwiQW5vbnltb3VzXCI7XG4gICAgICAgICAgd2FybihcbiAgICAgICAgICAgIGBDb21wb25lbnQgPCR7bmFtZX0+OiBzZXR1cCBmdW5jdGlvbiByZXR1cm5lZCBhIHByb21pc2UsIGJ1dCBubyA8U3VzcGVuc2U+IGJvdW5kYXJ5IHdhcyBmb3VuZCBpbiB0aGUgcGFyZW50IGNvbXBvbmVudCB0cmVlLiBBIGNvbXBvbmVudCB3aXRoIGFzeW5jIHNldHVwKCkgbXVzdCBiZSBuZXN0ZWQgaW4gYSA8U3VzcGVuc2U+IGluIG9yZGVyIHRvIGJlIHJlbmRlcmVkLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVNldHVwUmVzdWx0KGluc3RhbmNlLCBzZXR1cFJlc3VsdCwgaXNTU1IpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmaW5pc2hDb21wb25lbnRTZXR1cChpbnN0YW5jZSwgaXNTU1IpO1xuICB9XG59XG5mdW5jdGlvbiBoYW5kbGVTZXR1cFJlc3VsdChpbnN0YW5jZSwgc2V0dXBSZXN1bHQsIGlzU1NSKSB7XG4gIGlmIChpc0Z1bmN0aW9uKHNldHVwUmVzdWx0KSkge1xuICAgIGlmIChpbnN0YW5jZS50eXBlLl9fc3NySW5saW5lUmVuZGVyKSB7XG4gICAgICBpbnN0YW5jZS5zc3JSZW5kZXIgPSBzZXR1cFJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UucmVuZGVyID0gc2V0dXBSZXN1bHQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNldHVwUmVzdWx0KSkge1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIGlzVk5vZGUoc2V0dXBSZXN1bHQpKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgc2V0dXAoKSBzaG91bGQgbm90IHJldHVybiBWTm9kZXMgZGlyZWN0bHkgLSByZXR1cm4gYSByZW5kZXIgZnVuY3Rpb24gaW5zdGVhZC5gXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB8fCBfX1ZVRV9QUk9EX0RFVlRPT0xTX18pIHtcbiAgICAgIGluc3RhbmNlLmRldnRvb2xzUmF3U2V0dXBTdGF0ZSA9IHNldHVwUmVzdWx0O1xuICAgIH1cbiAgICBpbnN0YW5jZS5zZXR1cFN0YXRlID0gcHJveHlSZWZzKHNldHVwUmVzdWx0KTtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgZXhwb3NlU2V0dXBTdGF0ZU9uUmVuZGVyQ29udGV4dChpbnN0YW5jZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgc2V0dXBSZXN1bHQgIT09IHZvaWQgMCkge1xuICAgIHdhcm4oXG4gICAgICBgc2V0dXAoKSBzaG91bGQgcmV0dXJuIGFuIG9iamVjdC4gUmVjZWl2ZWQ6ICR7c2V0dXBSZXN1bHQgPT09IG51bGwgPyBcIm51bGxcIiA6IHR5cGVvZiBzZXR1cFJlc3VsdH1gXG4gICAgKTtcbiAgfVxuICBmaW5pc2hDb21wb25lbnRTZXR1cChpbnN0YW5jZSwgaXNTU1IpO1xufVxubGV0IGNvbXBpbGU7XG5sZXQgaW5zdGFsbFdpdGhQcm94eTtcbmZ1bmN0aW9uIHJlZ2lzdGVyUnVudGltZUNvbXBpbGVyKF9jb21waWxlKSB7XG4gIGNvbXBpbGUgPSBfY29tcGlsZTtcbiAgaW5zdGFsbFdpdGhQcm94eSA9IChpKSA9PiB7XG4gICAgaWYgKGkucmVuZGVyLl9yYykge1xuICAgICAgaS53aXRoUHJveHkgPSBuZXcgUHJveHkoaS5jdHgsIFJ1bnRpbWVDb21waWxlZFB1YmxpY0luc3RhbmNlUHJveHlIYW5kbGVycyk7XG4gICAgfVxuICB9O1xufVxuY29uc3QgaXNSdW50aW1lT25seSA9ICgpID0+ICFjb21waWxlO1xuZnVuY3Rpb24gZmluaXNoQ29tcG9uZW50U2V0dXAoaW5zdGFuY2UsIGlzU1NSLCBza2lwT3B0aW9ucykge1xuICBjb25zdCBDb21wb25lbnQgPSBpbnN0YW5jZS50eXBlO1xuICBpZiAoIWluc3RhbmNlLnJlbmRlcikge1xuICAgIGlmICghaXNTU1IgJiYgY29tcGlsZSAmJiAhQ29tcG9uZW50LnJlbmRlcikge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBDb21wb25lbnQudGVtcGxhdGUgfHwgcmVzb2x2ZU1lcmdlZE9wdGlvbnMoaW5zdGFuY2UpLnRlbXBsYXRlO1xuICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgc3RhcnRNZWFzdXJlKGluc3RhbmNlLCBgY29tcGlsZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgaXNDdXN0b21FbGVtZW50LCBjb21waWxlck9wdGlvbnMgfSA9IGluc3RhbmNlLmFwcENvbnRleHQuY29uZmlnO1xuICAgICAgICBjb25zdCB7IGRlbGltaXRlcnMsIGNvbXBpbGVyT3B0aW9uczogY29tcG9uZW50Q29tcGlsZXJPcHRpb25zIH0gPSBDb21wb25lbnQ7XG4gICAgICAgIGNvbnN0IGZpbmFsQ29tcGlsZXJPcHRpb25zID0gZXh0ZW5kKFxuICAgICAgICAgIGV4dGVuZChcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNDdXN0b21FbGVtZW50LFxuICAgICAgICAgICAgICBkZWxpbWl0ZXJzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZXJPcHRpb25zXG4gICAgICAgICAgKSxcbiAgICAgICAgICBjb21wb25lbnRDb21waWxlck9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgICAgQ29tcG9uZW50LnJlbmRlciA9IGNvbXBpbGUodGVtcGxhdGUsIGZpbmFsQ29tcGlsZXJPcHRpb25zKTtcbiAgICAgICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICBlbmRNZWFzdXJlKGluc3RhbmNlLCBgY29tcGlsZWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGluc3RhbmNlLnJlbmRlciA9IENvbXBvbmVudC5yZW5kZXIgfHwgTk9PUDtcbiAgICBpZiAoaW5zdGFsbFdpdGhQcm94eSkge1xuICAgICAgaW5zdGFsbFdpdGhQcm94eShpbnN0YW5jZSk7XG4gICAgfVxuICB9XG4gIGlmIChfX1ZVRV9PUFRJT05TX0FQSV9fICYmIHRydWUpIHtcbiAgICBzZXRDdXJyZW50SW5zdGFuY2UoaW5zdGFuY2UpO1xuICAgIHBhdXNlVHJhY2tpbmcoKTtcbiAgICBhcHBseU9wdGlvbnMoaW5zdGFuY2UpO1xuICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICB1bnNldEN1cnJlbnRJbnN0YW5jZSgpO1xuICB9XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFDb21wb25lbnQucmVuZGVyICYmIGluc3RhbmNlLnJlbmRlciA9PT0gTk9PUCAmJiAhaXNTU1IpIHtcbiAgICBpZiAoIWNvbXBpbGUgJiYgQ29tcG9uZW50LnRlbXBsYXRlKSB7XG4gICAgICB3YXJuKFxuICAgICAgICBgQ29tcG9uZW50IHByb3ZpZGVkIHRlbXBsYXRlIG9wdGlvbiBidXQgcnVudGltZSBjb21waWxhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnVpbGQgb2YgVnVlLmAgKyAoYCBDb25maWd1cmUgeW91ciBidW5kbGVyIHRvIGFsaWFzIFwidnVlXCIgdG8gXCJ2dWUvZGlzdC92dWUuZXNtLWJ1bmRsZXIuanNcIi5gIClcbiAgICAgICAgLyogc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdhcm4oYENvbXBvbmVudCBpcyBtaXNzaW5nIHRlbXBsYXRlIG9yIHJlbmRlciBmdW5jdGlvbi5gKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEF0dHJzUHJveHkoaW5zdGFuY2UpIHtcbiAgcmV0dXJuIGluc3RhbmNlLmF0dHJzUHJveHkgfHwgKGluc3RhbmNlLmF0dHJzUHJveHkgPSBuZXcgUHJveHkoXG4gICAgaW5zdGFuY2UuYXR0cnMsXG4gICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IHtcbiAgICAgIGdldCh0YXJnZXQsIGtleSkge1xuICAgICAgICBtYXJrQXR0cnNBY2Nlc3NlZCgpO1xuICAgICAgICB0cmFjayhpbnN0YW5jZSwgXCJnZXRcIiwgXCIkYXR0cnNcIik7XG4gICAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcbiAgICAgIH0sXG4gICAgICBzZXQoKSB7XG4gICAgICAgIHdhcm4oYHNldHVwQ29udGV4dC5hdHRycyBpcyByZWFkb25seS5gKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZVByb3BlcnR5KCkge1xuICAgICAgICB3YXJuKGBzZXR1cENvbnRleHQuYXR0cnMgaXMgcmVhZG9ubHkuYCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IDoge1xuICAgICAgZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICAgIHRyYWNrKGluc3RhbmNlLCBcImdldFwiLCBcIiRhdHRyc1wiKTtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgKSk7XG59XG5mdW5jdGlvbiBnZXRTbG90c1Byb3h5KGluc3RhbmNlKSB7XG4gIHJldHVybiBpbnN0YW5jZS5zbG90c1Byb3h5IHx8IChpbnN0YW5jZS5zbG90c1Byb3h5ID0gbmV3IFByb3h5KGluc3RhbmNlLnNsb3RzLCB7XG4gICAgZ2V0KHRhcmdldCwga2V5KSB7XG4gICAgICB0cmFjayhpbnN0YW5jZSwgXCJnZXRcIiwgXCIkc2xvdHNcIik7XG4gICAgICByZXR1cm4gdGFyZ2V0W2tleV07XG4gICAgfVxuICB9KSk7XG59XG5mdW5jdGlvbiBjcmVhdGVTZXR1cENvbnRleHQoaW5zdGFuY2UpIHtcbiAgY29uc3QgZXhwb3NlID0gKGV4cG9zZWQpID0+IHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgICAgaWYgKGluc3RhbmNlLmV4cG9zZWQpIHtcbiAgICAgICAgd2FybihgZXhwb3NlKCkgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uY2UgcGVyIHNldHVwKCkuYCk7XG4gICAgICB9XG4gICAgICBpZiAoZXhwb3NlZCAhPSBudWxsKSB7XG4gICAgICAgIGxldCBleHBvc2VkVHlwZSA9IHR5cGVvZiBleHBvc2VkO1xuICAgICAgICBpZiAoZXhwb3NlZFR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBpZiAoaXNBcnJheShleHBvc2VkKSkge1xuICAgICAgICAgICAgZXhwb3NlZFR5cGUgPSBcImFycmF5XCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChpc1JlZihleHBvc2VkKSkge1xuICAgICAgICAgICAgZXhwb3NlZFR5cGUgPSBcInJlZlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwb3NlZFR5cGUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgYGV4cG9zZSgpIHNob3VsZCBiZSBwYXNzZWQgYSBwbGFpbiBvYmplY3QsIHJlY2VpdmVkICR7ZXhwb3NlZFR5cGV9LmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGluc3RhbmNlLmV4cG9zZWQgPSBleHBvc2VkIHx8IHt9O1xuICB9O1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHtcbiAgICAgIGdldCBhdHRycygpIHtcbiAgICAgICAgcmV0dXJuIGdldEF0dHJzUHJveHkoaW5zdGFuY2UpO1xuICAgICAgfSxcbiAgICAgIGdldCBzbG90cygpIHtcbiAgICAgICAgcmV0dXJuIGdldFNsb3RzUHJveHkoaW5zdGFuY2UpO1xuICAgICAgfSxcbiAgICAgIGdldCBlbWl0KCkge1xuICAgICAgICByZXR1cm4gKGV2ZW50LCAuLi5hcmdzKSA9PiBpbnN0YW5jZS5lbWl0KGV2ZW50LCAuLi5hcmdzKTtcbiAgICAgIH0sXG4gICAgICBleHBvc2VcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0IGF0dHJzKCkge1xuICAgICAgICByZXR1cm4gZ2V0QXR0cnNQcm94eShpbnN0YW5jZSk7XG4gICAgICB9LFxuICAgICAgc2xvdHM6IGluc3RhbmNlLnNsb3RzLFxuICAgICAgZW1pdDogaW5zdGFuY2UuZW1pdCxcbiAgICAgIGV4cG9zZVxuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEV4cG9zZVByb3h5KGluc3RhbmNlKSB7XG4gIGlmIChpbnN0YW5jZS5leHBvc2VkKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmV4cG9zZVByb3h5IHx8IChpbnN0YW5jZS5leHBvc2VQcm94eSA9IG5ldyBQcm94eShwcm94eVJlZnMobWFya1JhdyhpbnN0YW5jZS5leHBvc2VkKSksIHtcbiAgICAgIGdldCh0YXJnZXQsIGtleSkge1xuICAgICAgICBpZiAoa2V5IGluIHRhcmdldCkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgaW4gcHVibGljUHJvcGVydGllc01hcCkge1xuICAgICAgICAgIHJldHVybiBwdWJsaWNQcm9wZXJ0aWVzTWFwW2tleV0oaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFzKHRhcmdldCwga2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgaW4gdGFyZ2V0IHx8IGtleSBpbiBwdWJsaWNQcm9wZXJ0aWVzTWFwO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxufVxuY29uc3QgY2xhc3NpZnlSRSA9IC8oPzpefFstX10pKFxcdykvZztcbmNvbnN0IGNsYXNzaWZ5ID0gKHN0cikgPT4gc3RyLnJlcGxhY2UoY2xhc3NpZnlSRSwgKGMpID0+IGMudG9VcHBlckNhc2UoKSkucmVwbGFjZSgvWy1fXS9nLCBcIlwiKTtcbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUoQ29tcG9uZW50LCBpbmNsdWRlSW5mZXJyZWQgPSB0cnVlKSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKENvbXBvbmVudCkgPyBDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgQ29tcG9uZW50Lm5hbWUgOiBDb21wb25lbnQubmFtZSB8fCBpbmNsdWRlSW5mZXJyZWQgJiYgQ29tcG9uZW50Ll9fbmFtZTtcbn1cbmZ1bmN0aW9uIGZvcm1hdENvbXBvbmVudE5hbWUoaW5zdGFuY2UsIENvbXBvbmVudCwgaXNSb290ID0gZmFsc2UpIHtcbiAgbGV0IG5hbWUgPSBnZXRDb21wb25lbnROYW1lKENvbXBvbmVudCk7XG4gIGlmICghbmFtZSAmJiBDb21wb25lbnQuX19maWxlKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBDb21wb25lbnQuX19maWxlLm1hdGNoKC8oW14vXFxcXF0rKVxcLlxcdyskLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBuYW1lID0gbWF0Y2hbMV07XG4gICAgfVxuICB9XG4gIGlmICghbmFtZSAmJiBpbnN0YW5jZSAmJiBpbnN0YW5jZS5wYXJlbnQpIHtcbiAgICBjb25zdCBpbmZlckZyb21SZWdpc3RyeSA9IChyZWdpc3RyeSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVnaXN0cnkpIHtcbiAgICAgICAgaWYgKHJlZ2lzdHJ5W2tleV0gPT09IENvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIG5hbWUgPSBpbmZlckZyb21SZWdpc3RyeShcbiAgICAgIGluc3RhbmNlLmNvbXBvbmVudHMgfHwgaW5zdGFuY2UucGFyZW50LnR5cGUuY29tcG9uZW50c1xuICAgICkgfHwgaW5mZXJGcm9tUmVnaXN0cnkoaW5zdGFuY2UuYXBwQ29udGV4dC5jb21wb25lbnRzKTtcbiAgfVxuICByZXR1cm4gbmFtZSA/IGNsYXNzaWZ5KG5hbWUpIDogaXNSb290ID8gYEFwcGAgOiBgQW5vbnltb3VzYDtcbn1cbmZ1bmN0aW9uIGlzQ2xhc3NDb21wb25lbnQodmFsdWUpIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUpICYmIFwiX192Y2NPcHRzXCIgaW4gdmFsdWU7XG59XG5cbmNvbnN0IGNvbXB1dGVkID0gKGdldHRlck9yT3B0aW9ucywgZGVidWdPcHRpb25zKSA9PiB7XG4gIHJldHVybiBjb21wdXRlZCQxKGdldHRlck9yT3B0aW9ucywgZGVidWdPcHRpb25zLCBpc0luU1NSQ29tcG9uZW50U2V0dXApO1xufTtcblxuZnVuY3Rpb24gaCh0eXBlLCBwcm9wc09yQ2hpbGRyZW4sIGNoaWxkcmVuKSB7XG4gIGNvbnN0IGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICBpZiAobCA9PT0gMikge1xuICAgIGlmIChpc09iamVjdChwcm9wc09yQ2hpbGRyZW4pICYmICFpc0FycmF5KHByb3BzT3JDaGlsZHJlbikpIHtcbiAgICAgIGlmIChpc1ZOb2RlKHByb3BzT3JDaGlsZHJlbikpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVZOb2RlKHR5cGUsIG51bGwsIFtwcm9wc09yQ2hpbGRyZW5dKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcmVhdGVWTm9kZSh0eXBlLCBwcm9wc09yQ2hpbGRyZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3JlYXRlVk5vZGUodHlwZSwgbnVsbCwgcHJvcHNPckNoaWxkcmVuKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGwgPiAzKSB7XG4gICAgICBjaGlsZHJlbiA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgfSBlbHNlIGlmIChsID09PSAzICYmIGlzVk5vZGUoY2hpbGRyZW4pKSB7XG4gICAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVWTm9kZSh0eXBlLCBwcm9wc09yQ2hpbGRyZW4sIGNoaWxkcmVuKTtcbiAgfVxufVxuXG5jb25zdCBzc3JDb250ZXh0S2V5ID0gU3ltYm9sLmZvcihcInYtc2N4XCIpO1xuY29uc3QgdXNlU1NSQ29udGV4dCA9ICgpID0+IHtcbiAge1xuICAgIGNvbnN0IGN0eCA9IGluamVjdChzc3JDb250ZXh0S2V5KTtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiB3YXJuKFxuICAgICAgICBgU2VydmVyIHJlbmRlcmluZyBjb250ZXh0IG5vdCBwcm92aWRlZC4gTWFrZSBzdXJlIHRvIG9ubHkgY2FsbCB1c2VTU1JDb250ZXh0KCkgY29uZGl0aW9uYWxseSBpbiB0aGUgc2VydmVyIGJ1aWxkLmBcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjdHg7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGlzU2hhbGxvdyh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWVbXCJfX3ZfaXNTaGFsbG93XCJdKTtcbn1cblxuZnVuY3Rpb24gaW5pdEN1c3RvbUZvcm1hdHRlcigpIHtcbiAgaWYgKCEhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHx8IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdnVlU3R5bGUgPSB7IHN0eWxlOiBcImNvbG9yOiMzYmE3NzZcIiB9O1xuICBjb25zdCBudW1iZXJTdHlsZSA9IHsgc3R5bGU6IFwiY29sb3I6IzBiMWJjOVwiIH07XG4gIGNvbnN0IHN0cmluZ1N0eWxlID0geyBzdHlsZTogXCJjb2xvcjojYjYyZTI0XCIgfTtcbiAgY29uc3Qga2V5d29yZFN0eWxlID0geyBzdHlsZTogXCJjb2xvcjojOWQyODhjXCIgfTtcbiAgY29uc3QgZm9ybWF0dGVyID0ge1xuICAgIGhlYWRlcihvYmopIHtcbiAgICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouX19pc1Z1ZSkge1xuICAgICAgICByZXR1cm4gW1wiZGl2XCIsIHZ1ZVN0eWxlLCBgVnVlSW5zdGFuY2VgXTtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZWYob2JqKSkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAge30sXG4gICAgICAgICAgW1wic3BhblwiLCB2dWVTdHlsZSwgZ2VuUmVmRmxhZyhvYmopXSxcbiAgICAgICAgICBcIjxcIixcbiAgICAgICAgICBmb3JtYXRWYWx1ZShvYmoudmFsdWUpLFxuICAgICAgICAgIGA+YFxuICAgICAgICBdO1xuICAgICAgfSBlbHNlIGlmIChpc1JlYWN0aXZlKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBcImRpdlwiLFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIFtcInNwYW5cIiwgdnVlU3R5bGUsIGlzU2hhbGxvdyhvYmopID8gXCJTaGFsbG93UmVhY3RpdmVcIiA6IFwiUmVhY3RpdmVcIl0sXG4gICAgICAgICAgXCI8XCIsXG4gICAgICAgICAgZm9ybWF0VmFsdWUob2JqKSxcbiAgICAgICAgICBgPiR7aXNSZWFkb25seShvYmopID8gYCAocmVhZG9ubHkpYCA6IGBgfWBcbiAgICAgICAgXTtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZWFkb25seShvYmopKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICB7fSxcbiAgICAgICAgICBbXCJzcGFuXCIsIHZ1ZVN0eWxlLCBpc1NoYWxsb3cob2JqKSA/IFwiU2hhbGxvd1JlYWRvbmx5XCIgOiBcIlJlYWRvbmx5XCJdLFxuICAgICAgICAgIFwiPFwiLFxuICAgICAgICAgIGZvcm1hdFZhbHVlKG9iaiksXG4gICAgICAgICAgXCI+XCJcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgaGFzQm9keShvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgb2JqLl9faXNWdWU7XG4gICAgfSxcbiAgICBib2R5KG9iaikge1xuICAgICAgaWYgKG9iaiAmJiBvYmouX19pc1Z1ZSkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAge30sXG4gICAgICAgICAgLi4uZm9ybWF0SW5zdGFuY2Uob2JqLiQpXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBmb3JtYXRJbnN0YW5jZShpbnN0YW5jZSkge1xuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xuICAgIGlmIChpbnN0YW5jZS50eXBlLnByb3BzICYmIGluc3RhbmNlLnByb3BzKSB7XG4gICAgICBibG9ja3MucHVzaChjcmVhdGVJbnN0YW5jZUJsb2NrKFwicHJvcHNcIiwgdG9SYXcoaW5zdGFuY2UucHJvcHMpKSk7XG4gICAgfVxuICAgIGlmIChpbnN0YW5jZS5zZXR1cFN0YXRlICE9PSBFTVBUWV9PQkopIHtcbiAgICAgIGJsb2Nrcy5wdXNoKGNyZWF0ZUluc3RhbmNlQmxvY2soXCJzZXR1cFwiLCBpbnN0YW5jZS5zZXR1cFN0YXRlKSk7XG4gICAgfVxuICAgIGlmIChpbnN0YW5jZS5kYXRhICE9PSBFTVBUWV9PQkopIHtcbiAgICAgIGJsb2Nrcy5wdXNoKGNyZWF0ZUluc3RhbmNlQmxvY2soXCJkYXRhXCIsIHRvUmF3KGluc3RhbmNlLmRhdGEpKSk7XG4gICAgfVxuICAgIGNvbnN0IGNvbXB1dGVkID0gZXh0cmFjdEtleXMoaW5zdGFuY2UsIFwiY29tcHV0ZWRcIik7XG4gICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICBibG9ja3MucHVzaChjcmVhdGVJbnN0YW5jZUJsb2NrKFwiY29tcHV0ZWRcIiwgY29tcHV0ZWQpKTtcbiAgICB9XG4gICAgY29uc3QgaW5qZWN0ZWQgPSBleHRyYWN0S2V5cyhpbnN0YW5jZSwgXCJpbmplY3RcIik7XG4gICAgaWYgKGluamVjdGVkKSB7XG4gICAgICBibG9ja3MucHVzaChjcmVhdGVJbnN0YW5jZUJsb2NrKFwiaW5qZWN0ZWRcIiwgaW5qZWN0ZWQpKTtcbiAgICB9XG4gICAgYmxvY2tzLnB1c2goW1xuICAgICAgXCJkaXZcIixcbiAgICAgIHt9LFxuICAgICAgW1xuICAgICAgICBcInNwYW5cIixcbiAgICAgICAge1xuICAgICAgICAgIHN0eWxlOiBrZXl3b3JkU3R5bGUuc3R5bGUgKyBcIjtvcGFjaXR5OjAuNjZcIlxuICAgICAgICB9LFxuICAgICAgICBcIiQgKGludGVybmFsKTogXCJcbiAgICAgIF0sXG4gICAgICBbXCJvYmplY3RcIiwgeyBvYmplY3Q6IGluc3RhbmNlIH1dXG4gICAgXSk7XG4gICAgcmV0dXJuIGJsb2NrcztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZUJsb2NrKHR5cGUsIHRhcmdldCkge1xuICAgIHRhcmdldCA9IGV4dGVuZCh7fSwgdGFyZ2V0KTtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRhcmdldCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW1wic3BhblwiLCB7fV07XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICBcImRpdlwiLFxuICAgICAgeyBzdHlsZTogXCJsaW5lLWhlaWdodDoxLjI1ZW07bWFyZ2luLWJvdHRvbTowLjZlbVwiIH0sXG4gICAgICBbXG4gICAgICAgIFwiZGl2XCIsXG4gICAgICAgIHtcbiAgICAgICAgICBzdHlsZTogXCJjb2xvcjojNDc2NTgyXCJcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZVxuICAgICAgXSxcbiAgICAgIFtcbiAgICAgICAgXCJkaXZcIixcbiAgICAgICAge1xuICAgICAgICAgIHN0eWxlOiBcInBhZGRpbmctbGVmdDoxLjI1ZW1cIlxuICAgICAgICB9LFxuICAgICAgICAuLi5PYmplY3Qua2V5cyh0YXJnZXQpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIFtcInNwYW5cIiwga2V5d29yZFN0eWxlLCBrZXkgKyBcIjogXCJdLFxuICAgICAgICAgICAgZm9ybWF0VmFsdWUodGFyZ2V0W2tleV0sIGZhbHNlKVxuICAgICAgICAgIF07XG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgXTtcbiAgfVxuICBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2LCBhc1JhdyA9IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIHYgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiBbXCJzcGFuXCIsIG51bWJlclN0eWxlLCB2XTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gW1wic3BhblwiLCBzdHJpbmdTdHlsZSwgSlNPTi5zdHJpbmdpZnkodildO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHYgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICByZXR1cm4gW1wic3BhblwiLCBrZXl3b3JkU3R5bGUsIHZdO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodikpIHtcbiAgICAgIHJldHVybiBbXCJvYmplY3RcIiwgeyBvYmplY3Q6IGFzUmF3ID8gdG9SYXcodikgOiB2IH1dO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1wic3BhblwiLCBzdHJpbmdTdHlsZSwgU3RyaW5nKHYpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZXh0cmFjdEtleXMoaW5zdGFuY2UsIHR5cGUpIHtcbiAgICBjb25zdCBDb21wID0gaW5zdGFuY2UudHlwZTtcbiAgICBpZiAoaXNGdW5jdGlvbihDb21wKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBleHRyYWN0ZWQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBpbnN0YW5jZS5jdHgpIHtcbiAgICAgIGlmIChpc0tleU9mVHlwZShDb21wLCBrZXksIHR5cGUpKSB7XG4gICAgICAgIGV4dHJhY3RlZFtrZXldID0gaW5zdGFuY2UuY3R4W2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gIH1cbiAgZnVuY3Rpb24gaXNLZXlPZlR5cGUoQ29tcCwga2V5LCB0eXBlKSB7XG4gICAgY29uc3Qgb3B0cyA9IENvbXBbdHlwZV07XG4gICAgaWYgKGlzQXJyYXkob3B0cykgJiYgb3B0cy5pbmNsdWRlcyhrZXkpIHx8IGlzT2JqZWN0KG9wdHMpICYmIGtleSBpbiBvcHRzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKENvbXAuZXh0ZW5kcyAmJiBpc0tleU9mVHlwZShDb21wLmV4dGVuZHMsIGtleSwgdHlwZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoQ29tcC5taXhpbnMgJiYgQ29tcC5taXhpbnMuc29tZSgobSkgPT4gaXNLZXlPZlR5cGUobSwga2V5LCB0eXBlKSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZW5SZWZGbGFnKHYpIHtcbiAgICBpZiAoaXNTaGFsbG93KHYpKSB7XG4gICAgICByZXR1cm4gYFNoYWxsb3dSZWZgO1xuICAgIH1cbiAgICBpZiAodi5lZmZlY3QpIHtcbiAgICAgIHJldHVybiBgQ29tcHV0ZWRSZWZgO1xuICAgIH1cbiAgICByZXR1cm4gYFJlZmA7XG4gIH1cbiAgaWYgKHdpbmRvdy5kZXZ0b29sc0Zvcm1hdHRlcnMpIHtcbiAgICB3aW5kb3cuZGV2dG9vbHNGb3JtYXR0ZXJzLnB1c2goZm9ybWF0dGVyKTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuZGV2dG9vbHNGb3JtYXR0ZXJzID0gW2Zvcm1hdHRlcl07XG4gIH1cbn1cblxuZnVuY3Rpb24gd2l0aE1lbW8obWVtbywgcmVuZGVyLCBjYWNoZSwgaW5kZXgpIHtcbiAgY29uc3QgY2FjaGVkID0gY2FjaGVbaW5kZXhdO1xuICBpZiAoY2FjaGVkICYmIGlzTWVtb1NhbWUoY2FjaGVkLCBtZW1vKSkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH1cbiAgY29uc3QgcmV0ID0gcmVuZGVyKCk7XG4gIHJldC5tZW1vID0gbWVtby5zbGljZSgpO1xuICByZXR1cm4gY2FjaGVbaW5kZXhdID0gcmV0O1xufVxuZnVuY3Rpb24gaXNNZW1vU2FtZShjYWNoZWQsIG1lbW8pIHtcbiAgY29uc3QgcHJldiA9IGNhY2hlZC5tZW1vO1xuICBpZiAocHJldi5sZW5ndGggIT0gbWVtby5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGhhc0NoYW5nZWQocHJldltpXSwgbWVtb1tpXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzQmxvY2tUcmVlRW5hYmxlZCA+IDAgJiYgY3VycmVudEJsb2NrKSB7XG4gICAgY3VycmVudEJsb2NrLnB1c2goY2FjaGVkKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuY29uc3QgdmVyc2lvbiA9IFwiMy4zLjRcIjtcbmNvbnN0IF9zc3JVdGlscyA9IHtcbiAgY3JlYXRlQ29tcG9uZW50SW5zdGFuY2UsXG4gIHNldHVwQ29tcG9uZW50LFxuICByZW5kZXJDb21wb25lbnRSb290LFxuICBzZXRDdXJyZW50UmVuZGVyaW5nSW5zdGFuY2UsXG4gIGlzVk5vZGU6IGlzVk5vZGUsXG4gIG5vcm1hbGl6ZVZOb2RlXG59O1xuY29uc3Qgc3NyVXRpbHMgPSBfc3NyVXRpbHMgO1xuY29uc3QgcmVzb2x2ZUZpbHRlciA9IG51bGw7XG5jb25zdCBjb21wYXRVdGlscyA9IG51bGw7XG5cbmV4cG9ydCB7IEJhc2VUcmFuc2l0aW9uLCBCYXNlVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycywgQ29tbWVudCwgRnJhZ21lbnQsIEtlZXBBbGl2ZSwgU3RhdGljLCBTdXNwZW5zZSwgVGVsZXBvcnQsIFRleHQsIGFzc2VydE51bWJlciwgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcsIGNhbGxXaXRoRXJyb3JIYW5kbGluZywgY2xvbmVWTm9kZSwgY29tcGF0VXRpbHMsIGNvbXB1dGVkLCBjcmVhdGVCbG9jaywgY3JlYXRlQ29tbWVudFZOb2RlLCBjcmVhdGVFbGVtZW50QmxvY2ssIGNyZWF0ZUJhc2VWTm9kZSBhcyBjcmVhdGVFbGVtZW50Vk5vZGUsIGNyZWF0ZUh5ZHJhdGlvblJlbmRlcmVyLCBjcmVhdGVQcm9wc1Jlc3RQcm94eSwgY3JlYXRlUmVuZGVyZXIsIGNyZWF0ZVNsb3RzLCBjcmVhdGVTdGF0aWNWTm9kZSwgY3JlYXRlVGV4dFZOb2RlLCBjcmVhdGVWTm9kZSwgZGVmaW5lQXN5bmNDb21wb25lbnQsIGRlZmluZUNvbXBvbmVudCwgZGVmaW5lRW1pdHMsIGRlZmluZUV4cG9zZSwgZGVmaW5lTW9kZWwsIGRlZmluZU9wdGlvbnMsIGRlZmluZVByb3BzLCBkZWZpbmVTbG90cywgZGV2dG9vbHMsIGdldEN1cnJlbnRJbnN0YW5jZSwgZ2V0VHJhbnNpdGlvblJhd0NoaWxkcmVuLCBndWFyZFJlYWN0aXZlUHJvcHMsIGgsIGhhbmRsZUVycm9yLCBoYXNJbmplY3Rpb25Db250ZXh0LCBpbml0Q3VzdG9tRm9ybWF0dGVyLCBpbmplY3QsIGlzTWVtb1NhbWUsIGlzUnVudGltZU9ubHksIGlzVk5vZGUsIG1lcmdlRGVmYXVsdHMsIG1lcmdlTW9kZWxzLCBtZXJnZVByb3BzLCBuZXh0VGljaywgb25BY3RpdmF0ZWQsIG9uQmVmb3JlTW91bnQsIG9uQmVmb3JlVW5tb3VudCwgb25CZWZvcmVVcGRhdGUsIG9uRGVhY3RpdmF0ZWQsIG9uRXJyb3JDYXB0dXJlZCwgb25Nb3VudGVkLCBvblJlbmRlclRyYWNrZWQsIG9uUmVuZGVyVHJpZ2dlcmVkLCBvblNlcnZlclByZWZldGNoLCBvblVubW91bnRlZCwgb25VcGRhdGVkLCBvcGVuQmxvY2ssIHBvcFNjb3BlSWQsIHByb3ZpZGUsIHB1c2hTY29wZUlkLCBxdWV1ZVBvc3RGbHVzaENiLCByZWdpc3RlclJ1bnRpbWVDb21waWxlciwgcmVuZGVyTGlzdCwgcmVuZGVyU2xvdCwgcmVzb2x2ZUNvbXBvbmVudCwgcmVzb2x2ZURpcmVjdGl2ZSwgcmVzb2x2ZUR5bmFtaWNDb21wb25lbnQsIHJlc29sdmVGaWx0ZXIsIHJlc29sdmVUcmFuc2l0aW9uSG9va3MsIHNldEJsb2NrVHJhY2tpbmcsIHNldERldnRvb2xzSG9vaywgc2V0VHJhbnNpdGlvbkhvb2tzLCBzc3JDb250ZXh0S2V5LCBzc3JVdGlscywgdG9IYW5kbGVycywgdHJhbnNmb3JtVk5vZGVBcmdzLCB1c2VBdHRycywgdXNlTW9kZWwsIHVzZVNTUkNvbnRleHQsIHVzZVNsb3RzLCB1c2VUcmFuc2l0aW9uU3RhdGUsIHZlcnNpb24sIHdhcm4sIHdhdGNoLCB3YXRjaEVmZmVjdCwgd2F0Y2hQb3N0RWZmZWN0LCB3YXRjaFN5bmNFZmZlY3QsIHdpdGhBc3luY0NvbnRleHQsIHdpdGhDdHgsIHdpdGhEZWZhdWx0cywgd2l0aERpcmVjdGl2ZXMsIHdpdGhNZW1vLCB3aXRoU2NvcGVJZCB9O1xuIiwiaW1wb3J0IHsgd2FybiwgY2FtZWxpemUsIGNhbGxXaXRoQXN5bmNFcnJvckhhbmRsaW5nLCBkZWZpbmVDb21wb25lbnQsIG5leHRUaWNrLCBjcmVhdGVWTm9kZSwgZ2V0Q3VycmVudEluc3RhbmNlLCB3YXRjaFBvc3RFZmZlY3QsIG9uTW91bnRlZCwgb25Vbm1vdW50ZWQsIEZyYWdtZW50LCBTdGF0aWMsIGgsIEJhc2VUcmFuc2l0aW9uLCBCYXNlVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycywgYXNzZXJ0TnVtYmVyLCB1c2VUcmFuc2l0aW9uU3RhdGUsIG9uVXBkYXRlZCwgdG9SYXcsIGdldFRyYW5zaXRpb25SYXdDaGlsZHJlbiwgc2V0VHJhbnNpdGlvbkhvb2tzLCByZXNvbHZlVHJhbnNpdGlvbkhvb2tzLCBpc1J1bnRpbWVPbmx5LCBjcmVhdGVSZW5kZXJlciwgY3JlYXRlSHlkcmF0aW9uUmVuZGVyZXIgfSBmcm9tICdAdnVlL3J1bnRpbWUtY29yZSc7XG5leHBvcnQgKiBmcm9tICdAdnVlL3J1bnRpbWUtY29yZSc7XG5pbXBvcnQgeyBpc1N0cmluZywgaXNBcnJheSwgaHlwaGVuYXRlLCBjYXBpdGFsaXplLCBpc1NwZWNpYWxCb29sZWFuQXR0ciwgaW5jbHVkZUJvb2xlYW5BdHRyLCBpc09uLCBpc01vZGVsTGlzdGVuZXIsIGlzRnVuY3Rpb24sIGNhbWVsaXplIGFzIGNhbWVsaXplJDEsIHRvTnVtYmVyLCBleHRlbmQsIEVNUFRZX09CSiwgaXNPYmplY3QsIGxvb3NlVG9OdW1iZXIsIGxvb3NlSW5kZXhPZiwgaXNTZXQsIGxvb3NlRXF1YWwsIGludm9rZUFycmF5Rm5zLCBpc0hUTUxUYWcsIGlzU1ZHVGFnIH0gZnJvbSAnQHZ1ZS9zaGFyZWQnO1xuXG5jb25zdCBzdmdOUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbmNvbnN0IGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IGRvY3VtZW50IDogbnVsbDtcbmNvbnN0IHRlbXBsYXRlQ29udGFpbmVyID0gZG9jICYmIC8qIEBfX1BVUkVfXyAqLyBkb2MuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpO1xuY29uc3Qgbm9kZU9wcyA9IHtcbiAgaW5zZXJ0OiAoY2hpbGQsIHBhcmVudCwgYW5jaG9yKSA9PiB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgYW5jaG9yIHx8IG51bGwpO1xuICB9LFxuICByZW1vdmU6IChjaGlsZCkgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IGNoaWxkLnBhcmVudE5vZGU7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICB9XG4gIH0sXG4gIGNyZWF0ZUVsZW1lbnQ6ICh0YWcsIGlzU1ZHLCBpcywgcHJvcHMpID0+IHtcbiAgICBjb25zdCBlbCA9IGlzU1ZHID8gZG9jLmNyZWF0ZUVsZW1lbnROUyhzdmdOUywgdGFnKSA6IGRvYy5jcmVhdGVFbGVtZW50KHRhZywgaXMgPyB7IGlzIH0gOiB2b2lkIDApO1xuICAgIGlmICh0YWcgPT09IFwic2VsZWN0XCIgJiYgcHJvcHMgJiYgcHJvcHMubXVsdGlwbGUgIT0gbnVsbCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwibXVsdGlwbGVcIiwgcHJvcHMubXVsdGlwbGUpO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH0sXG4gIGNyZWF0ZVRleHQ6ICh0ZXh0KSA9PiBkb2MuY3JlYXRlVGV4dE5vZGUodGV4dCksXG4gIGNyZWF0ZUNvbW1lbnQ6ICh0ZXh0KSA9PiBkb2MuY3JlYXRlQ29tbWVudCh0ZXh0KSxcbiAgc2V0VGV4dDogKG5vZGUsIHRleHQpID0+IHtcbiAgICBub2RlLm5vZGVWYWx1ZSA9IHRleHQ7XG4gIH0sXG4gIHNldEVsZW1lbnRUZXh0OiAoZWwsIHRleHQpID0+IHtcbiAgICBlbC50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH0sXG4gIHBhcmVudE5vZGU6IChub2RlKSA9PiBub2RlLnBhcmVudE5vZGUsXG4gIG5leHRTaWJsaW5nOiAobm9kZSkgPT4gbm9kZS5uZXh0U2libGluZyxcbiAgcXVlcnlTZWxlY3RvcjogKHNlbGVjdG9yKSA9PiBkb2MucXVlcnlTZWxlY3RvcihzZWxlY3RvciksXG4gIHNldFNjb3BlSWQoZWwsIGlkKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKGlkLCBcIlwiKTtcbiAgfSxcbiAgLy8gX19VTlNBRkVfX1xuICAvLyBSZWFzb246IGlubmVySFRNTC5cbiAgLy8gU3RhdGljIGNvbnRlbnQgaGVyZSBjYW4gb25seSBjb21lIGZyb20gY29tcGlsZWQgdGVtcGxhdGVzLlxuICAvLyBBcyBsb25nIGFzIHRoZSB1c2VyIG9ubHkgdXNlcyB0cnVzdGVkIHRlbXBsYXRlcywgdGhpcyBpcyBzYWZlLlxuICBpbnNlcnRTdGF0aWNDb250ZW50KGNvbnRlbnQsIHBhcmVudCwgYW5jaG9yLCBpc1NWRywgc3RhcnQsIGVuZCkge1xuICAgIGNvbnN0IGJlZm9yZSA9IGFuY2hvciA/IGFuY2hvci5wcmV2aW91c1NpYmxpbmcgOiBwYXJlbnQubGFzdENoaWxkO1xuICAgIGlmIChzdGFydCAmJiAoc3RhcnQgPT09IGVuZCB8fCBzdGFydC5uZXh0U2libGluZykpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoc3RhcnQuY2xvbmVOb2RlKHRydWUpLCBhbmNob3IpO1xuICAgICAgICBpZiAoc3RhcnQgPT09IGVuZCB8fCAhKHN0YXJ0ID0gc3RhcnQubmV4dFNpYmxpbmcpKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZW1wbGF0ZUNvbnRhaW5lci5pbm5lckhUTUwgPSBpc1NWRyA/IGA8c3ZnPiR7Y29udGVudH08L3N2Zz5gIDogY29udGVudDtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGVtcGxhdGVDb250YWluZXIuY29udGVudDtcbiAgICAgIGlmIChpc1NWRykge1xuICAgICAgICBjb25zdCB3cmFwcGVyID0gdGVtcGxhdGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKHdyYXBwZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHdyYXBwZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGVtcGxhdGUucmVtb3ZlQ2hpbGQod3JhcHBlcik7XG4gICAgICB9XG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHRlbXBsYXRlLCBhbmNob3IpO1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgLy8gZmlyc3RcbiAgICAgIGJlZm9yZSA/IGJlZm9yZS5uZXh0U2libGluZyA6IHBhcmVudC5maXJzdENoaWxkLFxuICAgICAgLy8gbGFzdFxuICAgICAgYW5jaG9yID8gYW5jaG9yLnByZXZpb3VzU2libGluZyA6IHBhcmVudC5sYXN0Q2hpbGRcbiAgICBdO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwYXRjaENsYXNzKGVsLCB2YWx1ZSwgaXNTVkcpIHtcbiAgY29uc3QgdHJhbnNpdGlvbkNsYXNzZXMgPSBlbC5fdnRjO1xuICBpZiAodHJhbnNpdGlvbkNsYXNzZXMpIHtcbiAgICB2YWx1ZSA9ICh2YWx1ZSA/IFt2YWx1ZSwgLi4udHJhbnNpdGlvbkNsYXNzZXNdIDogWy4uLnRyYW5zaXRpb25DbGFzc2VzXSkuam9pbihcIiBcIik7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgfSBlbHNlIGlmIChpc1NWRykge1xuICAgIGVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXRjaFN0eWxlKGVsLCBwcmV2LCBuZXh0KSB7XG4gIGNvbnN0IHN0eWxlID0gZWwuc3R5bGU7XG4gIGNvbnN0IGlzQ3NzU3RyaW5nID0gaXNTdHJpbmcobmV4dCk7XG4gIGlmIChuZXh0ICYmICFpc0Nzc1N0cmluZykge1xuICAgIGlmIChwcmV2ICYmICFpc1N0cmluZyhwcmV2KSkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJldikge1xuICAgICAgICBpZiAobmV4dFtrZXldID09IG51bGwpIHtcbiAgICAgICAgICBzZXRTdHlsZShzdHlsZSwga2V5LCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBuZXh0KSB7XG4gICAgICBzZXRTdHlsZShzdHlsZSwga2V5LCBuZXh0W2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBjdXJyZW50RGlzcGxheSA9IHN0eWxlLmRpc3BsYXk7XG4gICAgaWYgKGlzQ3NzU3RyaW5nKSB7XG4gICAgICBpZiAocHJldiAhPT0gbmV4dCkge1xuICAgICAgICBzdHlsZS5jc3NUZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByZXYpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgIH1cbiAgICBpZiAoXCJfdm9kXCIgaW4gZWwpIHtcbiAgICAgIHN0eWxlLmRpc3BsYXkgPSBjdXJyZW50RGlzcGxheTtcbiAgICB9XG4gIH1cbn1cbmNvbnN0IHNlbWljb2xvblJFID0gL1teXFxcXF07XFxzKiQvO1xuY29uc3QgaW1wb3J0YW50UkUgPSAvXFxzKiFpbXBvcnRhbnQkLztcbmZ1bmN0aW9uIHNldFN0eWxlKHN0eWxlLCBuYW1lLCB2YWwpIHtcbiAgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgIHZhbC5mb3JFYWNoKCh2KSA9PiBzZXRTdHlsZShzdHlsZSwgbmFtZSwgdikpO1xuICB9IGVsc2Uge1xuICAgIGlmICh2YWwgPT0gbnVsbClcbiAgICAgIHZhbCA9IFwiXCI7XG4gICAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgIGlmIChzZW1pY29sb25SRS50ZXN0KHZhbCkpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgVW5leHBlY3RlZCBzZW1pY29sb24gYXQgdGhlIGVuZCBvZiAnJHtuYW1lfScgc3R5bGUgdmFsdWU6ICcke3ZhbH0nYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmFtZS5zdGFydHNXaXRoKFwiLS1cIikpIHtcbiAgICAgIHN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByZWZpeGVkID0gYXV0b1ByZWZpeChzdHlsZSwgbmFtZSk7XG4gICAgICBpZiAoaW1wb3J0YW50UkUudGVzdCh2YWwpKSB7XG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgICAgIGh5cGhlbmF0ZShwcmVmaXhlZCksXG4gICAgICAgICAgdmFsLnJlcGxhY2UoaW1wb3J0YW50UkUsIFwiXCIpLFxuICAgICAgICAgIFwiaW1wb3J0YW50XCJcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlW3ByZWZpeGVkXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmNvbnN0IHByZWZpeGVzID0gW1wiV2Via2l0XCIsIFwiTW96XCIsIFwibXNcIl07XG5jb25zdCBwcmVmaXhDYWNoZSA9IHt9O1xuZnVuY3Rpb24gYXV0b1ByZWZpeChzdHlsZSwgcmF3TmFtZSkge1xuICBjb25zdCBjYWNoZWQgPSBwcmVmaXhDYWNoZVtyYXdOYW1lXTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIHJldHVybiBjYWNoZWQ7XG4gIH1cbiAgbGV0IG5hbWUgPSBjYW1lbGl6ZShyYXdOYW1lKTtcbiAgaWYgKG5hbWUgIT09IFwiZmlsdGVyXCIgJiYgbmFtZSBpbiBzdHlsZSkge1xuICAgIHJldHVybiBwcmVmaXhDYWNoZVtyYXdOYW1lXSA9IG5hbWU7XG4gIH1cbiAgbmFtZSA9IGNhcGl0YWxpemUobmFtZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwcmVmaXhlZCA9IHByZWZpeGVzW2ldICsgbmFtZTtcbiAgICBpZiAocHJlZml4ZWQgaW4gc3R5bGUpIHtcbiAgICAgIHJldHVybiBwcmVmaXhDYWNoZVtyYXdOYW1lXSA9IHByZWZpeGVkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3TmFtZTtcbn1cblxuY29uc3QgeGxpbmtOUyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuZnVuY3Rpb24gcGF0Y2hBdHRyKGVsLCBrZXksIHZhbHVlLCBpc1NWRywgaW5zdGFuY2UpIHtcbiAgaWYgKGlzU1ZHICYmIGtleS5zdGFydHNXaXRoKFwieGxpbms6XCIpKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rTlMsIGtleS5zbGljZSg2LCBrZXkubGVuZ3RoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rTlMsIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpc0Jvb2xlYW4gPSBpc1NwZWNpYWxCb29sZWFuQXR0cihrZXkpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IGlzQm9vbGVhbiAmJiAhaW5jbHVkZUJvb2xlYW5BdHRyKHZhbHVlKSkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIGlzQm9vbGVhbiA/IFwiXCIgOiB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBhdGNoRE9NUHJvcChlbCwga2V5LCB2YWx1ZSwgcHJldkNoaWxkcmVuLCBwYXJlbnRDb21wb25lbnQsIHBhcmVudFN1c3BlbnNlLCB1bm1vdW50Q2hpbGRyZW4pIHtcbiAgaWYgKGtleSA9PT0gXCJpbm5lckhUTUxcIiB8fCBrZXkgPT09IFwidGV4dENvbnRlbnRcIikge1xuICAgIGlmIChwcmV2Q2hpbGRyZW4pIHtcbiAgICAgIHVubW91bnRDaGlsZHJlbihwcmV2Q2hpbGRyZW4sIHBhcmVudENvbXBvbmVudCwgcGFyZW50U3VzcGVuc2UpO1xuICAgIH1cbiAgICBlbFtrZXldID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZTtcbiAgaWYgKGtleSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyAhPT0gXCJQUk9HUkVTU1wiICYmIC8vIGN1c3RvbSBlbGVtZW50cyBtYXkgdXNlIF92YWx1ZSBpbnRlcm5hbGx5XG4gICF0YWcuaW5jbHVkZXMoXCItXCIpKSB7XG4gICAgZWwuX3ZhbHVlID0gdmFsdWU7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0YWcgPT09IFwiT1BUSU9OXCIgPyBlbC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA6IGVsLnZhbHVlO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZTtcbiAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICBlbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBsZXQgbmVlZFJlbW92ZSA9IGZhbHNlO1xuICBpZiAodmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT0gbnVsbCkge1xuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgZWxba2V5XTtcbiAgICBpZiAodHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIHZhbHVlID0gaW5jbHVkZUJvb2xlYW5BdHRyKHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09IG51bGwgJiYgdHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgbmVlZFJlbW92ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICB2YWx1ZSA9IDA7XG4gICAgICBuZWVkUmVtb3ZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgdHJ5IHtcbiAgICBlbFtrZXldID0gdmFsdWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSAmJiAhbmVlZFJlbW92ZSkge1xuICAgICAgd2FybihcbiAgICAgICAgYEZhaWxlZCBzZXR0aW5nIHByb3AgXCIke2tleX1cIiBvbiA8JHt0YWcudG9Mb3dlckNhc2UoKX0+OiB2YWx1ZSAke3ZhbHVlfSBpcyBpbnZhbGlkLmAsXG4gICAgICAgIGVcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIG5lZWRSZW1vdmUgJiYgZWwucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoZWwsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcihlbCwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwYXRjaEV2ZW50KGVsLCByYXdOYW1lLCBwcmV2VmFsdWUsIG5leHRWYWx1ZSwgaW5zdGFuY2UgPSBudWxsKSB7XG4gIGNvbnN0IGludm9rZXJzID0gZWwuX3ZlaSB8fCAoZWwuX3ZlaSA9IHt9KTtcbiAgY29uc3QgZXhpc3RpbmdJbnZva2VyID0gaW52b2tlcnNbcmF3TmFtZV07XG4gIGlmIChuZXh0VmFsdWUgJiYgZXhpc3RpbmdJbnZva2VyKSB7XG4gICAgZXhpc3RpbmdJbnZva2VyLnZhbHVlID0gbmV4dFZhbHVlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFtuYW1lLCBvcHRpb25zXSA9IHBhcnNlTmFtZShyYXdOYW1lKTtcbiAgICBpZiAobmV4dFZhbHVlKSB7XG4gICAgICBjb25zdCBpbnZva2VyID0gaW52b2tlcnNbcmF3TmFtZV0gPSBjcmVhdGVJbnZva2VyKG5leHRWYWx1ZSwgaW5zdGFuY2UpO1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgbmFtZSwgaW52b2tlciwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChleGlzdGluZ0ludm9rZXIpIHtcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoZWwsIG5hbWUsIGV4aXN0aW5nSW52b2tlciwgb3B0aW9ucyk7XG4gICAgICBpbnZva2Vyc1tyYXdOYW1lXSA9IHZvaWQgMDtcbiAgICB9XG4gIH1cbn1cbmNvbnN0IG9wdGlvbnNNb2RpZmllclJFID0gLyg/Ok9uY2V8UGFzc2l2ZXxDYXB0dXJlKSQvO1xuZnVuY3Rpb24gcGFyc2VOYW1lKG5hbWUpIHtcbiAgbGV0IG9wdGlvbnM7XG4gIGlmIChvcHRpb25zTW9kaWZpZXJSRS50ZXN0KG5hbWUpKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICAgIGxldCBtO1xuICAgIHdoaWxlIChtID0gbmFtZS5tYXRjaChvcHRpb25zTW9kaWZpZXJSRSkpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnNsaWNlKDAsIG5hbWUubGVuZ3RoIC0gbVswXS5sZW5ndGgpO1xuICAgICAgb3B0aW9uc1ttWzBdLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgY29uc3QgZXZlbnQgPSBuYW1lWzJdID09PSBcIjpcIiA/IG5hbWUuc2xpY2UoMykgOiBoeXBoZW5hdGUobmFtZS5zbGljZSgyKSk7XG4gIHJldHVybiBbZXZlbnQsIG9wdGlvbnNdO1xufVxubGV0IGNhY2hlZE5vdyA9IDA7XG5jb25zdCBwID0gLyogQF9fUFVSRV9fICovIFByb21pc2UucmVzb2x2ZSgpO1xuY29uc3QgZ2V0Tm93ID0gKCkgPT4gY2FjaGVkTm93IHx8IChwLnRoZW4oKCkgPT4gY2FjaGVkTm93ID0gMCksIGNhY2hlZE5vdyA9IERhdGUubm93KCkpO1xuZnVuY3Rpb24gY3JlYXRlSW52b2tlcihpbml0aWFsVmFsdWUsIGluc3RhbmNlKSB7XG4gIGNvbnN0IGludm9rZXIgPSAoZSkgPT4ge1xuICAgIGlmICghZS5fdnRzKSB7XG4gICAgICBlLl92dHMgPSBEYXRlLm5vdygpO1xuICAgIH0gZWxzZSBpZiAoZS5fdnRzIDw9IGludm9rZXIuYXR0YWNoZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2FsbFdpdGhBc3luY0Vycm9ySGFuZGxpbmcoXG4gICAgICBwYXRjaFN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbihlLCBpbnZva2VyLnZhbHVlKSxcbiAgICAgIGluc3RhbmNlLFxuICAgICAgNSxcbiAgICAgIFtlXVxuICAgICk7XG4gIH07XG4gIGludm9rZXIudmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gIGludm9rZXIuYXR0YWNoZWQgPSBnZXROb3coKTtcbiAgcmV0dXJuIGludm9rZXI7XG59XG5mdW5jdGlvbiBwYXRjaFN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbihlLCB2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBjb25zdCBvcmlnaW5hbFN0b3AgPSBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjtcbiAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiA9ICgpID0+IHtcbiAgICAgIG9yaWdpbmFsU3RvcC5jYWxsKGUpO1xuICAgICAgZS5fc3RvcHBlZCA9IHRydWU7XG4gICAgfTtcbiAgICByZXR1cm4gdmFsdWUubWFwKChmbikgPT4gKGUyKSA9PiAhZTIuX3N0b3BwZWQgJiYgZm4gJiYgZm4oZTIpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuY29uc3QgbmF0aXZlT25SRSA9IC9eb25bYS16XS87XG5jb25zdCBwYXRjaFByb3AgPSAoZWwsIGtleSwgcHJldlZhbHVlLCBuZXh0VmFsdWUsIGlzU1ZHID0gZmFsc2UsIHByZXZDaGlsZHJlbiwgcGFyZW50Q29tcG9uZW50LCBwYXJlbnRTdXNwZW5zZSwgdW5tb3VudENoaWxkcmVuKSA9PiB7XG4gIGlmIChrZXkgPT09IFwiY2xhc3NcIikge1xuICAgIHBhdGNoQ2xhc3MoZWwsIG5leHRWYWx1ZSwgaXNTVkcpO1xuICB9IGVsc2UgaWYgKGtleSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgcGF0Y2hTdHlsZShlbCwgcHJldlZhbHVlLCBuZXh0VmFsdWUpO1xuICB9IGVsc2UgaWYgKGlzT24oa2V5KSkge1xuICAgIGlmICghaXNNb2RlbExpc3RlbmVyKGtleSkpIHtcbiAgICAgIHBhdGNoRXZlbnQoZWwsIGtleSwgcHJldlZhbHVlLCBuZXh0VmFsdWUsIHBhcmVudENvbXBvbmVudCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGtleVswXSA9PT0gXCIuXCIgPyAoa2V5ID0ga2V5LnNsaWNlKDEpLCB0cnVlKSA6IGtleVswXSA9PT0gXCJeXCIgPyAoa2V5ID0ga2V5LnNsaWNlKDEpLCBmYWxzZSkgOiBzaG91bGRTZXRBc1Byb3AoZWwsIGtleSwgbmV4dFZhbHVlLCBpc1NWRykpIHtcbiAgICBwYXRjaERPTVByb3AoXG4gICAgICBlbCxcbiAgICAgIGtleSxcbiAgICAgIG5leHRWYWx1ZSxcbiAgICAgIHByZXZDaGlsZHJlbixcbiAgICAgIHBhcmVudENvbXBvbmVudCxcbiAgICAgIHBhcmVudFN1c3BlbnNlLFxuICAgICAgdW5tb3VudENoaWxkcmVuXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoa2V5ID09PSBcInRydWUtdmFsdWVcIikge1xuICAgICAgZWwuX3RydWVWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJmYWxzZS12YWx1ZVwiKSB7XG4gICAgICBlbC5fZmFsc2VWYWx1ZSA9IG5leHRWYWx1ZTtcbiAgICB9XG4gICAgcGF0Y2hBdHRyKGVsLCBrZXksIG5leHRWYWx1ZSwgaXNTVkcpO1xuICB9XG59O1xuZnVuY3Rpb24gc2hvdWxkU2V0QXNQcm9wKGVsLCBrZXksIHZhbHVlLCBpc1NWRykge1xuICBpZiAoaXNTVkcpIHtcbiAgICBpZiAoa2V5ID09PSBcImlubmVySFRNTFwiIHx8IGtleSA9PT0gXCJ0ZXh0Q29udGVudFwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGtleSBpbiBlbCAmJiBuYXRpdmVPblJFLnRlc3Qoa2V5KSAmJiBpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoa2V5ID09PSBcInNwZWxsY2hlY2tcIiB8fCBrZXkgPT09IFwiZHJhZ2dhYmxlXCIgfHwga2V5ID09PSBcInRyYW5zbGF0ZVwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChrZXkgPT09IFwiZm9ybVwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChrZXkgPT09IFwibGlzdFwiICYmIGVsLnRhZ05hbWUgPT09IFwiSU5QVVRcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoa2V5ID09PSBcInR5cGVcIiAmJiBlbC50YWdOYW1lID09PSBcIlRFWFRBUkVBXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG5hdGl2ZU9uUkUudGVzdChrZXkpICYmIGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4ga2V5IGluIGVsO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVDdXN0b21FbGVtZW50KG9wdGlvbnMsIGh5ZHJhdGUyKSB7XG4gIGNvbnN0IENvbXAgPSBkZWZpbmVDb21wb25lbnQob3B0aW9ucyk7XG4gIGNsYXNzIFZ1ZUN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBWdWVFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsUHJvcHMpIHtcbiAgICAgIHN1cGVyKENvbXAsIGluaXRpYWxQcm9wcywgaHlkcmF0ZTIpO1xuICAgIH1cbiAgfVxuICBWdWVDdXN0b21FbGVtZW50LmRlZiA9IENvbXA7XG4gIHJldHVybiBWdWVDdXN0b21FbGVtZW50O1xufVxuY29uc3QgZGVmaW5lU1NSQ3VzdG9tRWxlbWVudCA9IChvcHRpb25zKSA9PiB7XG4gIHJldHVybiBkZWZpbmVDdXN0b21FbGVtZW50KG9wdGlvbnMsIGh5ZHJhdGUpO1xufTtcbmNvbnN0IEJhc2VDbGFzcyA9IHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiA/IEhUTUxFbGVtZW50IDogY2xhc3Mge1xufTtcbmNsYXNzIFZ1ZUVsZW1lbnQgZXh0ZW5kcyBCYXNlQ2xhc3Mge1xuICBjb25zdHJ1Y3RvcihfZGVmLCBfcHJvcHMgPSB7fSwgaHlkcmF0ZTIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RlZiA9IF9kZWY7XG4gICAgdGhpcy5fcHJvcHMgPSBfcHJvcHM7XG4gICAgLyoqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgdGhpcy5faW5zdGFuY2UgPSBudWxsO1xuICAgIHRoaXMuX2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3Jlc29sdmVkID0gZmFsc2U7XG4gICAgdGhpcy5fbnVtYmVyUHJvcHMgPSBudWxsO1xuICAgIGlmICh0aGlzLnNoYWRvd1Jvb3QgJiYgaHlkcmF0ZTIpIHtcbiAgICAgIGh5ZHJhdGUyKHRoaXMuX2NyZWF0ZVZOb2RlKCksIHRoaXMuc2hhZG93Um9vdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHRoaXMuc2hhZG93Um9vdCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIGBDdXN0b20gZWxlbWVudCBoYXMgcHJlLXJlbmRlcmVkIGRlY2xhcmF0aXZlIHNoYWRvdyByb290IGJ1dCBpcyBub3QgZGVmaW5lZCBhcyBoeWRyYXRhYmxlLiBVc2UgXFxgZGVmaW5lU1NSQ3VzdG9tRWxlbWVudFxcYC5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6IFwib3BlblwiIH0pO1xuICAgICAgaWYgKCF0aGlzLl9kZWYuX19hc3luY0xvYWRlcikge1xuICAgICAgICB0aGlzLl9yZXNvbHZlUHJvcHModGhpcy5fZGVmKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5fY29ubmVjdGVkID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XG4gICAgICBpZiAodGhpcy5fcmVzb2x2ZWQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXNvbHZlRGVmKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuX2Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fY29ubmVjdGVkKSB7XG4gICAgICAgIHJlbmRlcihudWxsLCB0aGlzLnNoYWRvd1Jvb3QpO1xuICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIHJlc29sdmUgaW5uZXIgY29tcG9uZW50IGRlZmluaXRpb24gKGhhbmRsZSBwb3NzaWJsZSBhc3luYyBjb21wb25lbnQpXG4gICAqL1xuICBfcmVzb2x2ZURlZigpIHtcbiAgICB0aGlzLl9yZXNvbHZlZCA9IHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuX3NldEF0dHIodGhpcy5hdHRyaWJ1dGVzW2ldLm5hbWUpO1xuICAgIH1cbiAgICBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgIHRoaXMuX3NldEF0dHIobS5hdHRyaWJ1dGVOYW1lKTtcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHRoaXMsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcbiAgICBjb25zdCByZXNvbHZlID0gKGRlZiwgaXNBc3luYyA9IGZhbHNlKSA9PiB7XG4gICAgICBjb25zdCB7IHByb3BzLCBzdHlsZXMgfSA9IGRlZjtcbiAgICAgIGxldCBudW1iZXJQcm9wcztcbiAgICAgIGlmIChwcm9wcyAmJiAhaXNBcnJheShwcm9wcykpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgICAgICBjb25zdCBvcHQgPSBwcm9wc1trZXldO1xuICAgICAgICAgIGlmIChvcHQgPT09IE51bWJlciB8fCBvcHQgJiYgb3B0LnR5cGUgPT09IE51bWJlcikge1xuICAgICAgICAgICAgaWYgKGtleSBpbiB0aGlzLl9wcm9wcykge1xuICAgICAgICAgICAgICB0aGlzLl9wcm9wc1trZXldID0gdG9OdW1iZXIodGhpcy5fcHJvcHNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAobnVtYmVyUHJvcHMgfHwgKG51bWJlclByb3BzID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCkpKVtjYW1lbGl6ZSQxKGtleSldID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX251bWJlclByb3BzID0gbnVtYmVyUHJvcHM7XG4gICAgICBpZiAoaXNBc3luYykge1xuICAgICAgICB0aGlzLl9yZXNvbHZlUHJvcHMoZGVmKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FwcGx5U3R5bGVzKHN0eWxlcyk7XG4gICAgICB0aGlzLl91cGRhdGUoKTtcbiAgICB9O1xuICAgIGNvbnN0IGFzeW5jRGVmID0gdGhpcy5fZGVmLl9fYXN5bmNMb2FkZXI7XG4gICAgaWYgKGFzeW5jRGVmKSB7XG4gICAgICBhc3luY0RlZigpLnRoZW4oKGRlZikgPT4gcmVzb2x2ZShkZWYsIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZSh0aGlzLl9kZWYpO1xuICAgIH1cbiAgfVxuICBfcmVzb2x2ZVByb3BzKGRlZikge1xuICAgIGNvbnN0IHsgcHJvcHMgfSA9IGRlZjtcbiAgICBjb25zdCBkZWNsYXJlZFByb3BLZXlzID0gaXNBcnJheShwcm9wcykgPyBwcm9wcyA6IE9iamVjdC5rZXlzKHByb3BzIHx8IHt9KTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzKSkge1xuICAgICAgaWYgKGtleVswXSAhPT0gXCJfXCIgJiYgZGVjbGFyZWRQcm9wS2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgIHRoaXMuX3NldFByb3Aoa2V5LCB0aGlzW2tleV0sIHRydWUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgZGVjbGFyZWRQcm9wS2V5cy5tYXAoY2FtZWxpemUkMSkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRQcm9wKGtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWwpIHtcbiAgICAgICAgICB0aGlzLl9zZXRQcm9wKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIF9zZXRBdHRyKGtleSkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKGtleSk7XG4gICAgY29uc3QgY2FtZWxLZXkgPSBjYW1lbGl6ZSQxKGtleSk7XG4gICAgaWYgKHRoaXMuX251bWJlclByb3BzICYmIHRoaXMuX251bWJlclByb3BzW2NhbWVsS2V5XSkge1xuICAgICAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX3NldFByb3AoY2FtZWxLZXksIHZhbHVlLCBmYWxzZSk7XG4gIH1cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2dldFByb3Aoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3BzW2tleV07XG4gIH1cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3NldFByb3Aoa2V5LCB2YWwsIHNob3VsZFJlZmxlY3QgPSB0cnVlLCBzaG91bGRVcGRhdGUgPSB0cnVlKSB7XG4gICAgaWYgKHZhbCAhPT0gdGhpcy5fcHJvcHNba2V5XSkge1xuICAgICAgdGhpcy5fcHJvcHNba2V5XSA9IHZhbDtcbiAgICAgIGlmIChzaG91bGRVcGRhdGUgJiYgdGhpcy5faW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAoc2hvdWxkUmVmbGVjdCkge1xuICAgICAgICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoaHlwaGVuYXRlKGtleSksIFwiXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGh5cGhlbmF0ZShrZXkpLCB2YWwgKyBcIlwiKTtcbiAgICAgICAgfSBlbHNlIGlmICghdmFsKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoaHlwaGVuYXRlKGtleSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF91cGRhdGUoKSB7XG4gICAgcmVuZGVyKHRoaXMuX2NyZWF0ZVZOb2RlKCksIHRoaXMuc2hhZG93Um9vdCk7XG4gIH1cbiAgX2NyZWF0ZVZOb2RlKCkge1xuICAgIGNvbnN0IHZub2RlID0gY3JlYXRlVk5vZGUodGhpcy5fZGVmLCBleHRlbmQoe30sIHRoaXMuX3Byb3BzKSk7XG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xuICAgICAgdm5vZGUuY2UgPSAoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgaW5zdGFuY2UuaXNDRSA9IHRydWU7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgaW5zdGFuY2UuY2VSZWxvYWQgPSAobmV3U3R5bGVzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3R5bGVzKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3N0eWxlcy5mb3JFYWNoKChzKSA9PiB0aGlzLnNoYWRvd1Jvb3QucmVtb3ZlQ2hpbGQocykpO1xuICAgICAgICAgICAgICB0aGlzLl9zdHlsZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FwcGx5U3R5bGVzKG5ld1N0eWxlcyk7XG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpc3BhdGNoID0gKGV2ZW50LCBhcmdzKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGV2ZW50LCB7XG4gICAgICAgICAgICAgIGRldGFpbDogYXJnc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgICAgICBpbnN0YW5jZS5lbWl0ID0gKGV2ZW50LCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgZGlzcGF0Y2goZXZlbnQsIGFyZ3MpO1xuICAgICAgICAgIGlmIChoeXBoZW5hdGUoZXZlbnQpICE9PSBldmVudCkge1xuICAgICAgICAgICAgZGlzcGF0Y2goaHlwaGVuYXRlKGV2ZW50KSwgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcztcbiAgICAgICAgd2hpbGUgKHBhcmVudCA9IHBhcmVudCAmJiAocGFyZW50LnBhcmVudE5vZGUgfHwgcGFyZW50Lmhvc3QpKSB7XG4gICAgICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFZ1ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnBhcmVudCA9IHBhcmVudC5faW5zdGFuY2U7XG4gICAgICAgICAgICBpbnN0YW5jZS5wcm92aWRlcyA9IHBhcmVudC5faW5zdGFuY2UucHJvdmlkZXM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB2bm9kZTtcbiAgfVxuICBfYXBwbHlTdHlsZXMoc3R5bGVzKSB7XG4gICAgaWYgKHN0eWxlcykge1xuICAgICAgc3R5bGVzLmZvckVhY2goKGNzcykgPT4ge1xuICAgICAgICBjb25zdCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICBzLnRleHRDb250ZW50ID0gY3NzO1xuICAgICAgICB0aGlzLnNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQocyk7XG4gICAgICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgICAgICAgKHRoaXMuX3N0eWxlcyB8fCAodGhpcy5fc3R5bGVzID0gW10pKS5wdXNoKHMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdXNlQ3NzTW9kdWxlKG5hbWUgPSBcIiRzdHlsZVwiKSB7XG4gIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihgdXNlQ3NzTW9kdWxlIG11c3QgYmUgY2FsbGVkIGluc2lkZSBzZXR1cCgpYCk7XG4gICAgICByZXR1cm4gRU1QVFlfT0JKO1xuICAgIH1cbiAgICBjb25zdCBtb2R1bGVzID0gaW5zdGFuY2UudHlwZS5fX2Nzc01vZHVsZXM7XG4gICAgaWYgKCFtb2R1bGVzKSB7XG4gICAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYEN1cnJlbnQgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBDU1MgbW9kdWxlcyBpbmplY3RlZC5gKTtcbiAgICAgIHJldHVybiBFTVBUWV9PQko7XG4gICAgfVxuICAgIGNvbnN0IG1vZCA9IG1vZHVsZXNbbmFtZV07XG4gICAgaWYgKCFtb2QpIHtcbiAgICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihgQ3VycmVudCBpbnN0YW5jZSBkb2VzIG5vdCBoYXZlIENTUyBtb2R1bGUgbmFtZWQgXCIke25hbWV9XCIuYCk7XG4gICAgICByZXR1cm4gRU1QVFlfT0JKO1xuICAgIH1cbiAgICByZXR1cm4gbW9kO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVzZUNzc1ZhcnMoZ2V0dGVyKSB7XG4gIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICAhIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmIHdhcm4oYHVzZUNzc1ZhcnMgaXMgY2FsbGVkIHdpdGhvdXQgY3VycmVudCBhY3RpdmUgY29tcG9uZW50IGluc3RhbmNlLmApO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1cGRhdGVUZWxlcG9ydHMgPSBpbnN0YW5jZS51dCA9ICh2YXJzID0gZ2V0dGVyKGluc3RhbmNlLnByb3h5KSkgPT4ge1xuICAgIEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS12LW93bmVyPVwiJHtpbnN0YW5jZS51aWR9XCJdYClcbiAgICApLmZvckVhY2goKG5vZGUpID0+IHNldFZhcnNPbk5vZGUobm9kZSwgdmFycykpO1xuICB9O1xuICBjb25zdCBzZXRWYXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHZhcnMgPSBnZXR0ZXIoaW5zdGFuY2UucHJveHkpO1xuICAgIHNldFZhcnNPblZOb2RlKGluc3RhbmNlLnN1YlRyZWUsIHZhcnMpO1xuICAgIHVwZGF0ZVRlbGVwb3J0cyh2YXJzKTtcbiAgfTtcbiAgd2F0Y2hQb3N0RWZmZWN0KHNldFZhcnMpO1xuICBvbk1vdW50ZWQoKCkgPT4ge1xuICAgIGNvbnN0IG9iID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoc2V0VmFycyk7XG4gICAgb2Iub2JzZXJ2ZShpbnN0YW5jZS5zdWJUcmVlLmVsLnBhcmVudE5vZGUsIHsgY2hpbGRMaXN0OiB0cnVlIH0pO1xuICAgIG9uVW5tb3VudGVkKCgpID0+IG9iLmRpc2Nvbm5lY3QoKSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gc2V0VmFyc09uVk5vZGUodm5vZGUsIHZhcnMpIHtcbiAgaWYgKHZub2RlLnNoYXBlRmxhZyAmIDEyOCkge1xuICAgIGNvbnN0IHN1c3BlbnNlID0gdm5vZGUuc3VzcGVuc2U7XG4gICAgdm5vZGUgPSBzdXNwZW5zZS5hY3RpdmVCcmFuY2g7XG4gICAgaWYgKHN1c3BlbnNlLnBlbmRpbmdCcmFuY2ggJiYgIXN1c3BlbnNlLmlzSHlkcmF0aW5nKSB7XG4gICAgICBzdXNwZW5zZS5lZmZlY3RzLnB1c2goKCkgPT4ge1xuICAgICAgICBzZXRWYXJzT25WTm9kZShzdXNwZW5zZS5hY3RpdmVCcmFuY2gsIHZhcnMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHdoaWxlICh2bm9kZS5jb21wb25lbnQpIHtcbiAgICB2bm9kZSA9IHZub2RlLmNvbXBvbmVudC5zdWJUcmVlO1xuICB9XG4gIGlmICh2bm9kZS5zaGFwZUZsYWcgJiAxICYmIHZub2RlLmVsKSB7XG4gICAgc2V0VmFyc09uTm9kZSh2bm9kZS5lbCwgdmFycyk7XG4gIH0gZWxzZSBpZiAodm5vZGUudHlwZSA9PT0gRnJhZ21lbnQpIHtcbiAgICB2bm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiBzZXRWYXJzT25WTm9kZShjLCB2YXJzKSk7XG4gIH0gZWxzZSBpZiAodm5vZGUudHlwZSA9PT0gU3RhdGljKSB7XG4gICAgbGV0IHsgZWwsIGFuY2hvciB9ID0gdm5vZGU7XG4gICAgd2hpbGUgKGVsKSB7XG4gICAgICBzZXRWYXJzT25Ob2RlKGVsLCB2YXJzKTtcbiAgICAgIGlmIChlbCA9PT0gYW5jaG9yKVxuICAgICAgICBicmVhaztcbiAgICAgIGVsID0gZWwubmV4dFNpYmxpbmc7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBzZXRWYXJzT25Ob2RlKGVsLCB2YXJzKSB7XG4gIGlmIChlbC5ub2RlVHlwZSA9PT0gMSkge1xuICAgIGNvbnN0IHN0eWxlID0gZWwuc3R5bGU7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdmFycykge1xuICAgICAgc3R5bGUuc2V0UHJvcGVydHkoYC0tJHtrZXl9YCwgdmFyc1trZXldKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgVFJBTlNJVElPTiA9IFwidHJhbnNpdGlvblwiO1xuY29uc3QgQU5JTUFUSU9OID0gXCJhbmltYXRpb25cIjtcbmNvbnN0IFRyYW5zaXRpb24gPSAocHJvcHMsIHsgc2xvdHMgfSkgPT4gaChCYXNlVHJhbnNpdGlvbiwgcmVzb2x2ZVRyYW5zaXRpb25Qcm9wcyhwcm9wcyksIHNsb3RzKTtcblRyYW5zaXRpb24uZGlzcGxheU5hbWUgPSBcIlRyYW5zaXRpb25cIjtcbmNvbnN0IERPTVRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMgPSB7XG4gIG5hbWU6IFN0cmluZyxcbiAgdHlwZTogU3RyaW5nLFxuICBjc3M6IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgZHVyYXRpb246IFtTdHJpbmcsIE51bWJlciwgT2JqZWN0XSxcbiAgZW50ZXJGcm9tQ2xhc3M6IFN0cmluZyxcbiAgZW50ZXJBY3RpdmVDbGFzczogU3RyaW5nLFxuICBlbnRlclRvQ2xhc3M6IFN0cmluZyxcbiAgYXBwZWFyRnJvbUNsYXNzOiBTdHJpbmcsXG4gIGFwcGVhckFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gIGFwcGVhclRvQ2xhc3M6IFN0cmluZyxcbiAgbGVhdmVGcm9tQ2xhc3M6IFN0cmluZyxcbiAgbGVhdmVBY3RpdmVDbGFzczogU3RyaW5nLFxuICBsZWF2ZVRvQ2xhc3M6IFN0cmluZ1xufTtcbmNvbnN0IFRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMgPSBUcmFuc2l0aW9uLnByb3BzID0gLyogQF9fUFVSRV9fICovIGV4dGVuZChcbiAge30sXG4gIEJhc2VUcmFuc2l0aW9uUHJvcHNWYWxpZGF0b3JzLFxuICBET01UcmFuc2l0aW9uUHJvcHNWYWxpZGF0b3JzXG4pO1xuY29uc3QgY2FsbEhvb2sgPSAoaG9vaywgYXJncyA9IFtdKSA9PiB7XG4gIGlmIChpc0FycmF5KGhvb2spKSB7XG4gICAgaG9vay5mb3JFYWNoKChoMikgPT4gaDIoLi4uYXJncykpO1xuICB9IGVsc2UgaWYgKGhvb2spIHtcbiAgICBob29rKC4uLmFyZ3MpO1xuICB9XG59O1xuY29uc3QgaGFzRXhwbGljaXRDYWxsYmFjayA9IChob29rKSA9PiB7XG4gIHJldHVybiBob29rID8gaXNBcnJheShob29rKSA/IGhvb2suc29tZSgoaDIpID0+IGgyLmxlbmd0aCA+IDEpIDogaG9vay5sZW5ndGggPiAxIDogZmFsc2U7XG59O1xuZnVuY3Rpb24gcmVzb2x2ZVRyYW5zaXRpb25Qcm9wcyhyYXdQcm9wcykge1xuICBjb25zdCBiYXNlUHJvcHMgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gcmF3UHJvcHMpIHtcbiAgICBpZiAoIShrZXkgaW4gRE9NVHJhbnNpdGlvblByb3BzVmFsaWRhdG9ycykpIHtcbiAgICAgIGJhc2VQcm9wc1trZXldID0gcmF3UHJvcHNba2V5XTtcbiAgICB9XG4gIH1cbiAgaWYgKHJhd1Byb3BzLmNzcyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gYmFzZVByb3BzO1xuICB9XG4gIGNvbnN0IHtcbiAgICBuYW1lID0gXCJ2XCIsXG4gICAgdHlwZSxcbiAgICBkdXJhdGlvbixcbiAgICBlbnRlckZyb21DbGFzcyA9IGAke25hbWV9LWVudGVyLWZyb21gLFxuICAgIGVudGVyQWN0aXZlQ2xhc3MgPSBgJHtuYW1lfS1lbnRlci1hY3RpdmVgLFxuICAgIGVudGVyVG9DbGFzcyA9IGAke25hbWV9LWVudGVyLXRvYCxcbiAgICBhcHBlYXJGcm9tQ2xhc3MgPSBlbnRlckZyb21DbGFzcyxcbiAgICBhcHBlYXJBY3RpdmVDbGFzcyA9IGVudGVyQWN0aXZlQ2xhc3MsXG4gICAgYXBwZWFyVG9DbGFzcyA9IGVudGVyVG9DbGFzcyxcbiAgICBsZWF2ZUZyb21DbGFzcyA9IGAke25hbWV9LWxlYXZlLWZyb21gLFxuICAgIGxlYXZlQWN0aXZlQ2xhc3MgPSBgJHtuYW1lfS1sZWF2ZS1hY3RpdmVgLFxuICAgIGxlYXZlVG9DbGFzcyA9IGAke25hbWV9LWxlYXZlLXRvYFxuICB9ID0gcmF3UHJvcHM7XG4gIGNvbnN0IGR1cmF0aW9ucyA9IG5vcm1hbGl6ZUR1cmF0aW9uKGR1cmF0aW9uKTtcbiAgY29uc3QgZW50ZXJEdXJhdGlvbiA9IGR1cmF0aW9ucyAmJiBkdXJhdGlvbnNbMF07XG4gIGNvbnN0IGxlYXZlRHVyYXRpb24gPSBkdXJhdGlvbnMgJiYgZHVyYXRpb25zWzFdO1xuICBjb25zdCB7XG4gICAgb25CZWZvcmVFbnRlcixcbiAgICBvbkVudGVyLFxuICAgIG9uRW50ZXJDYW5jZWxsZWQsXG4gICAgb25MZWF2ZSxcbiAgICBvbkxlYXZlQ2FuY2VsbGVkLFxuICAgIG9uQmVmb3JlQXBwZWFyID0gb25CZWZvcmVFbnRlcixcbiAgICBvbkFwcGVhciA9IG9uRW50ZXIsXG4gICAgb25BcHBlYXJDYW5jZWxsZWQgPSBvbkVudGVyQ2FuY2VsbGVkXG4gIH0gPSBiYXNlUHJvcHM7XG4gIGNvbnN0IGZpbmlzaEVudGVyID0gKGVsLCBpc0FwcGVhciwgZG9uZSkgPT4ge1xuICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgaXNBcHBlYXIgPyBhcHBlYXJUb0NsYXNzIDogZW50ZXJUb0NsYXNzKTtcbiAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGlzQXBwZWFyID8gYXBwZWFyQWN0aXZlQ2xhc3MgOiBlbnRlckFjdGl2ZUNsYXNzKTtcbiAgICBkb25lICYmIGRvbmUoKTtcbiAgfTtcbiAgY29uc3QgZmluaXNoTGVhdmUgPSAoZWwsIGRvbmUpID0+IHtcbiAgICBlbC5faXNMZWF2aW5nID0gZmFsc2U7XG4gICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUZyb21DbGFzcyk7XG4gICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZVRvQ2xhc3MpO1xuICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbGVhdmVBY3RpdmVDbGFzcyk7XG4gICAgZG9uZSAmJiBkb25lKCk7XG4gIH07XG4gIGNvbnN0IG1ha2VFbnRlckhvb2sgPSAoaXNBcHBlYXIpID0+IHtcbiAgICByZXR1cm4gKGVsLCBkb25lKSA9PiB7XG4gICAgICBjb25zdCBob29rID0gaXNBcHBlYXIgPyBvbkFwcGVhciA6IG9uRW50ZXI7XG4gICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gZmluaXNoRW50ZXIoZWwsIGlzQXBwZWFyLCBkb25lKTtcbiAgICAgIGNhbGxIb29rKGhvb2ssIFtlbCwgcmVzb2x2ZV0pO1xuICAgICAgbmV4dEZyYW1lKCgpID0+IHtcbiAgICAgICAgcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBpc0FwcGVhciA/IGFwcGVhckZyb21DbGFzcyA6IGVudGVyRnJvbUNsYXNzKTtcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBpc0FwcGVhciA/IGFwcGVhclRvQ2xhc3MgOiBlbnRlclRvQ2xhc3MpO1xuICAgICAgICBpZiAoIWhhc0V4cGxpY2l0Q2FsbGJhY2soaG9vaykpIHtcbiAgICAgICAgICB3aGVuVHJhbnNpdGlvbkVuZHMoZWwsIHR5cGUsIGVudGVyRHVyYXRpb24sIHJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuICByZXR1cm4gZXh0ZW5kKGJhc2VQcm9wcywge1xuICAgIG9uQmVmb3JlRW50ZXIoZWwpIHtcbiAgICAgIGNhbGxIb29rKG9uQmVmb3JlRW50ZXIsIFtlbF0pO1xuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBlbnRlckZyb21DbGFzcyk7XG4gICAgICBhZGRUcmFuc2l0aW9uQ2xhc3MoZWwsIGVudGVyQWN0aXZlQ2xhc3MpO1xuICAgIH0sXG4gICAgb25CZWZvcmVBcHBlYXIoZWwpIHtcbiAgICAgIGNhbGxIb29rKG9uQmVmb3JlQXBwZWFyLCBbZWxdKTtcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgYXBwZWFyRnJvbUNsYXNzKTtcbiAgICAgIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgYXBwZWFyQWN0aXZlQ2xhc3MpO1xuICAgIH0sXG4gICAgb25FbnRlcjogbWFrZUVudGVySG9vayhmYWxzZSksXG4gICAgb25BcHBlYXI6IG1ha2VFbnRlckhvb2sodHJ1ZSksXG4gICAgb25MZWF2ZShlbCwgZG9uZSkge1xuICAgICAgZWwuX2lzTGVhdmluZyA9IHRydWU7XG4gICAgICBjb25zdCByZXNvbHZlID0gKCkgPT4gZmluaXNoTGVhdmUoZWwsIGRvbmUpO1xuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUZyb21DbGFzcyk7XG4gICAgICBmb3JjZVJlZmxvdygpO1xuICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZUFjdGl2ZUNsYXNzKTtcbiAgICAgIG5leHRGcmFtZSgoKSA9PiB7XG4gICAgICAgIGlmICghZWwuX2lzTGVhdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZW1vdmVUcmFuc2l0aW9uQ2xhc3MoZWwsIGxlYXZlRnJvbUNsYXNzKTtcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBsZWF2ZVRvQ2xhc3MpO1xuICAgICAgICBpZiAoIWhhc0V4cGxpY2l0Q2FsbGJhY2sob25MZWF2ZSkpIHtcbiAgICAgICAgICB3aGVuVHJhbnNpdGlvbkVuZHMoZWwsIHR5cGUsIGxlYXZlRHVyYXRpb24sIHJlc29sdmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNhbGxIb29rKG9uTGVhdmUsIFtlbCwgcmVzb2x2ZV0pO1xuICAgIH0sXG4gICAgb25FbnRlckNhbmNlbGxlZChlbCkge1xuICAgICAgZmluaXNoRW50ZXIoZWwsIGZhbHNlKTtcbiAgICAgIGNhbGxIb29rKG9uRW50ZXJDYW5jZWxsZWQsIFtlbF0pO1xuICAgIH0sXG4gICAgb25BcHBlYXJDYW5jZWxsZWQoZWwpIHtcbiAgICAgIGZpbmlzaEVudGVyKGVsLCB0cnVlKTtcbiAgICAgIGNhbGxIb29rKG9uQXBwZWFyQ2FuY2VsbGVkLCBbZWxdKTtcbiAgICB9LFxuICAgIG9uTGVhdmVDYW5jZWxsZWQoZWwpIHtcbiAgICAgIGZpbmlzaExlYXZlKGVsKTtcbiAgICAgIGNhbGxIb29rKG9uTGVhdmVDYW5jZWxsZWQsIFtlbF0pO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBub3JtYWxpemVEdXJhdGlvbihkdXJhdGlvbikge1xuICBpZiAoZHVyYXRpb24gPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGR1cmF0aW9uKSkge1xuICAgIHJldHVybiBbTnVtYmVyT2YoZHVyYXRpb24uZW50ZXIpLCBOdW1iZXJPZihkdXJhdGlvbi5sZWF2ZSldO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBOdW1iZXJPZihkdXJhdGlvbik7XG4gICAgcmV0dXJuIFtuLCBuXTtcbiAgfVxufVxuZnVuY3Rpb24gTnVtYmVyT2YodmFsKSB7XG4gIGNvbnN0IHJlcyA9IHRvTnVtYmVyKHZhbCk7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgYXNzZXJ0TnVtYmVyKHJlcywgXCI8dHJhbnNpdGlvbj4gZXhwbGljaXQgZHVyYXRpb25cIik7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbmZ1bmN0aW9uIGFkZFRyYW5zaXRpb25DbGFzcyhlbCwgY2xzKSB7XG4gIGNscy5zcGxpdCgvXFxzKy8pLmZvckVhY2goKGMpID0+IGMgJiYgZWwuY2xhc3NMaXN0LmFkZChjKSk7XG4gIChlbC5fdnRjIHx8IChlbC5fdnRjID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSkpLmFkZChjbHMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkNsYXNzKGVsLCBjbHMpIHtcbiAgY2xzLnNwbGl0KC9cXHMrLykuZm9yRWFjaCgoYykgPT4gYyAmJiBlbC5jbGFzc0xpc3QucmVtb3ZlKGMpKTtcbiAgY29uc3QgeyBfdnRjIH0gPSBlbDtcbiAgaWYgKF92dGMpIHtcbiAgICBfdnRjLmRlbGV0ZShjbHMpO1xuICAgIGlmICghX3Z0Yy5zaXplKSB7XG4gICAgICBlbC5fdnRjID0gdm9pZCAwO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gbmV4dEZyYW1lKGNiKSB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcbiAgfSk7XG59XG5sZXQgZW5kSWQgPSAwO1xuZnVuY3Rpb24gd2hlblRyYW5zaXRpb25FbmRzKGVsLCBleHBlY3RlZFR5cGUsIGV4cGxpY2l0VGltZW91dCwgcmVzb2x2ZSkge1xuICBjb25zdCBpZCA9IGVsLl9lbmRJZCA9ICsrZW5kSWQ7XG4gIGNvbnN0IHJlc29sdmVJZk5vdFN0YWxlID0gKCkgPT4ge1xuICAgIGlmIChpZCA9PT0gZWwuX2VuZElkKSB7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfVxuICB9O1xuICBpZiAoZXhwbGljaXRUaW1lb3V0KSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQocmVzb2x2ZUlmTm90U3RhbGUsIGV4cGxpY2l0VGltZW91dCk7XG4gIH1cbiAgY29uc3QgeyB0eXBlLCB0aW1lb3V0LCBwcm9wQ291bnQgfSA9IGdldFRyYW5zaXRpb25JbmZvKGVsLCBleHBlY3RlZFR5cGUpO1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICB9XG4gIGNvbnN0IGVuZEV2ZW50ID0gdHlwZSArIFwiZW5kXCI7XG4gIGxldCBlbmRlZCA9IDA7XG4gIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGVuZEV2ZW50LCBvbkVuZCk7XG4gICAgcmVzb2x2ZUlmTm90U3RhbGUoKTtcbiAgfTtcbiAgY29uc3Qgb25FbmQgPSAoZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldCA9PT0gZWwgJiYgKytlbmRlZCA+PSBwcm9wQ291bnQpIHtcbiAgICAgIGVuZCgpO1xuICAgIH1cbiAgfTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGVuZGVkIDwgcHJvcENvdW50KSB7XG4gICAgICBlbmQoKTtcbiAgICB9XG4gIH0sIHRpbWVvdXQgKyAxKTtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihlbmRFdmVudCwgb25FbmQpO1xufVxuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbkluZm8oZWwsIGV4cGVjdGVkVHlwZSkge1xuICBjb25zdCBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGdldFN0eWxlUHJvcGVydGllcyA9IChrZXkpID0+IChzdHlsZXNba2V5XSB8fCBcIlwiKS5zcGxpdChcIiwgXCIpO1xuICBjb25zdCB0cmFuc2l0aW9uRGVsYXlzID0gZ2V0U3R5bGVQcm9wZXJ0aWVzKGAke1RSQU5TSVRJT059RGVsYXlgKTtcbiAgY29uc3QgdHJhbnNpdGlvbkR1cmF0aW9ucyA9IGdldFN0eWxlUHJvcGVydGllcyhgJHtUUkFOU0lUSU9OfUR1cmF0aW9uYCk7XG4gIGNvbnN0IHRyYW5zaXRpb25UaW1lb3V0ID0gZ2V0VGltZW91dCh0cmFuc2l0aW9uRGVsYXlzLCB0cmFuc2l0aW9uRHVyYXRpb25zKTtcbiAgY29uc3QgYW5pbWF0aW9uRGVsYXlzID0gZ2V0U3R5bGVQcm9wZXJ0aWVzKGAke0FOSU1BVElPTn1EZWxheWApO1xuICBjb25zdCBhbmltYXRpb25EdXJhdGlvbnMgPSBnZXRTdHlsZVByb3BlcnRpZXMoYCR7QU5JTUFUSU9OfUR1cmF0aW9uYCk7XG4gIGNvbnN0IGFuaW1hdGlvblRpbWVvdXQgPSBnZXRUaW1lb3V0KGFuaW1hdGlvbkRlbGF5cywgYW5pbWF0aW9uRHVyYXRpb25zKTtcbiAgbGV0IHR5cGUgPSBudWxsO1xuICBsZXQgdGltZW91dCA9IDA7XG4gIGxldCBwcm9wQ291bnQgPSAwO1xuICBpZiAoZXhwZWN0ZWRUeXBlID09PSBUUkFOU0lUSU9OKSB7XG4gICAgaWYgKHRyYW5zaXRpb25UaW1lb3V0ID4gMCkge1xuICAgICAgdHlwZSA9IFRSQU5TSVRJT047XG4gICAgICB0aW1lb3V0ID0gdHJhbnNpdGlvblRpbWVvdXQ7XG4gICAgICBwcm9wQ291bnQgPSB0cmFuc2l0aW9uRHVyYXRpb25zLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSBBTklNQVRJT04pIHtcbiAgICBpZiAoYW5pbWF0aW9uVGltZW91dCA+IDApIHtcbiAgICAgIHR5cGUgPSBBTklNQVRJT047XG4gICAgICB0aW1lb3V0ID0gYW5pbWF0aW9uVGltZW91dDtcbiAgICAgIHByb3BDb3VudCA9IGFuaW1hdGlvbkR1cmF0aW9ucy5sZW5ndGg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRpbWVvdXQgPSBNYXRoLm1heCh0cmFuc2l0aW9uVGltZW91dCwgYW5pbWF0aW9uVGltZW91dCk7XG4gICAgdHlwZSA9IHRpbWVvdXQgPiAwID8gdHJhbnNpdGlvblRpbWVvdXQgPiBhbmltYXRpb25UaW1lb3V0ID8gVFJBTlNJVElPTiA6IEFOSU1BVElPTiA6IG51bGw7XG4gICAgcHJvcENvdW50ID0gdHlwZSA/IHR5cGUgPT09IFRSQU5TSVRJT04gPyB0cmFuc2l0aW9uRHVyYXRpb25zLmxlbmd0aCA6IGFuaW1hdGlvbkR1cmF0aW9ucy5sZW5ndGggOiAwO1xuICB9XG4gIGNvbnN0IGhhc1RyYW5zZm9ybSA9IHR5cGUgPT09IFRSQU5TSVRJT04gJiYgL1xcYih0cmFuc2Zvcm18YWxsKSgsfCQpLy50ZXN0KFxuICAgIGdldFN0eWxlUHJvcGVydGllcyhgJHtUUkFOU0lUSU9OfVByb3BlcnR5YCkudG9TdHJpbmcoKVxuICApO1xuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgdGltZW91dCxcbiAgICBwcm9wQ291bnQsXG4gICAgaGFzVHJhbnNmb3JtXG4gIH07XG59XG5mdW5jdGlvbiBnZXRUaW1lb3V0KGRlbGF5cywgZHVyYXRpb25zKSB7XG4gIHdoaWxlIChkZWxheXMubGVuZ3RoIDwgZHVyYXRpb25zLmxlbmd0aCkge1xuICAgIGRlbGF5cyA9IGRlbGF5cy5jb25jYXQoZGVsYXlzKTtcbiAgfVxuICByZXR1cm4gTWF0aC5tYXgoLi4uZHVyYXRpb25zLm1hcCgoZCwgaSkgPT4gdG9NcyhkKSArIHRvTXMoZGVsYXlzW2ldKSkpO1xufVxuZnVuY3Rpb24gdG9NcyhzKSB7XG4gIHJldHVybiBOdW1iZXIocy5zbGljZSgwLCAtMSkucmVwbGFjZShcIixcIiwgXCIuXCIpKSAqIDFlMztcbn1cbmZ1bmN0aW9uIGZvcmNlUmVmbG93KCkge1xuICByZXR1cm4gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG59XG5cbmNvbnN0IHBvc2l0aW9uTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5jb25zdCBuZXdQb3NpdGlvbk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuY29uc3QgVHJhbnNpdGlvbkdyb3VwSW1wbCA9IHtcbiAgbmFtZTogXCJUcmFuc2l0aW9uR3JvdXBcIixcbiAgcHJvcHM6IC8qIEBfX1BVUkVfXyAqLyBleHRlbmQoe30sIFRyYW5zaXRpb25Qcm9wc1ZhbGlkYXRvcnMsIHtcbiAgICB0YWc6IFN0cmluZyxcbiAgICBtb3ZlQ2xhc3M6IFN0cmluZ1xuICB9KSxcbiAgc2V0dXAocHJvcHMsIHsgc2xvdHMgfSkge1xuICAgIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKCk7XG4gICAgY29uc3Qgc3RhdGUgPSB1c2VUcmFuc2l0aW9uU3RhdGUoKTtcbiAgICBsZXQgcHJldkNoaWxkcmVuO1xuICAgIGxldCBjaGlsZHJlbjtcbiAgICBvblVwZGF0ZWQoKCkgPT4ge1xuICAgICAgaWYgKCFwcmV2Q2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vdmVDbGFzcyA9IHByb3BzLm1vdmVDbGFzcyB8fCBgJHtwcm9wcy5uYW1lIHx8IFwidlwifS1tb3ZlYDtcbiAgICAgIGlmICghaGFzQ1NTVHJhbnNmb3JtKFxuICAgICAgICBwcmV2Q2hpbGRyZW5bMF0uZWwsXG4gICAgICAgIGluc3RhbmNlLnZub2RlLmVsLFxuICAgICAgICBtb3ZlQ2xhc3NcbiAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcHJldkNoaWxkcmVuLmZvckVhY2goY2FsbFBlbmRpbmdDYnMpO1xuICAgICAgcHJldkNoaWxkcmVuLmZvckVhY2gocmVjb3JkUG9zaXRpb24pO1xuICAgICAgY29uc3QgbW92ZWRDaGlsZHJlbiA9IHByZXZDaGlsZHJlbi5maWx0ZXIoYXBwbHlUcmFuc2xhdGlvbik7XG4gICAgICBmb3JjZVJlZmxvdygpO1xuICAgICAgbW92ZWRDaGlsZHJlbi5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gYy5lbDtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBlbC5zdHlsZTtcbiAgICAgICAgYWRkVHJhbnNpdGlvbkNsYXNzKGVsLCBtb3ZlQ2xhc3MpO1xuICAgICAgICBzdHlsZS50cmFuc2Zvcm0gPSBzdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBzdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBcIlwiO1xuICAgICAgICBjb25zdCBjYiA9IGVsLl9tb3ZlQ2IgPSAoZSkgPT4ge1xuICAgICAgICAgIGlmIChlICYmIGUudGFyZ2V0ICE9PSBlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWUgfHwgL3RyYW5zZm9ybSQvLnRlc3QoZS5wcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBjYik7XG4gICAgICAgICAgICBlbC5fbW92ZUNiID0gbnVsbDtcbiAgICAgICAgICAgIHJlbW92ZVRyYW5zaXRpb25DbGFzcyhlbCwgbW92ZUNsYXNzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGNiKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCByYXdQcm9wcyA9IHRvUmF3KHByb3BzKTtcbiAgICAgIGNvbnN0IGNzc1RyYW5zaXRpb25Qcm9wcyA9IHJlc29sdmVUcmFuc2l0aW9uUHJvcHMocmF3UHJvcHMpO1xuICAgICAgbGV0IHRhZyA9IHJhd1Byb3BzLnRhZyB8fCBGcmFnbWVudDtcbiAgICAgIHByZXZDaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgY2hpbGRyZW4gPSBzbG90cy5kZWZhdWx0ID8gZ2V0VHJhbnNpdGlvblJhd0NoaWxkcmVuKHNsb3RzLmRlZmF1bHQoKSkgOiBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGNoaWxkLmtleSAhPSBudWxsKSB7XG4gICAgICAgICAgc2V0VHJhbnNpdGlvbkhvb2tzKFxuICAgICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgICByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKGNoaWxkLCBjc3NUcmFuc2l0aW9uUHJvcHMsIHN0YXRlLCBpbnN0YW5jZSlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICAgICAgICB3YXJuKGA8VHJhbnNpdGlvbkdyb3VwPiBjaGlsZHJlbiBtdXN0IGJlIGtleWVkLmApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJldkNoaWxkcmVuKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldkNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgY2hpbGQgPSBwcmV2Q2hpbGRyZW5baV07XG4gICAgICAgICAgc2V0VHJhbnNpdGlvbkhvb2tzKFxuICAgICAgICAgICAgY2hpbGQsXG4gICAgICAgICAgICByZXNvbHZlVHJhbnNpdGlvbkhvb2tzKGNoaWxkLCBjc3NUcmFuc2l0aW9uUHJvcHMsIHN0YXRlLCBpbnN0YW5jZSlcbiAgICAgICAgICApO1xuICAgICAgICAgIHBvc2l0aW9uTWFwLnNldChjaGlsZCwgY2hpbGQuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3JlYXRlVk5vZGUodGFnLCBudWxsLCBjaGlsZHJlbik7XG4gICAgfTtcbiAgfVxufTtcbmNvbnN0IHJlbW92ZU1vZGUgPSAocHJvcHMpID0+IGRlbGV0ZSBwcm9wcy5tb2RlO1xuLyogQF9fUFVSRV9fICovIHJlbW92ZU1vZGUoVHJhbnNpdGlvbkdyb3VwSW1wbC5wcm9wcyk7XG5jb25zdCBUcmFuc2l0aW9uR3JvdXAgPSBUcmFuc2l0aW9uR3JvdXBJbXBsO1xuZnVuY3Rpb24gY2FsbFBlbmRpbmdDYnMoYykge1xuICBjb25zdCBlbCA9IGMuZWw7XG4gIGlmIChlbC5fbW92ZUNiKSB7XG4gICAgZWwuX21vdmVDYigpO1xuICB9XG4gIGlmIChlbC5fZW50ZXJDYikge1xuICAgIGVsLl9lbnRlckNiKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlY29yZFBvc2l0aW9uKGMpIHtcbiAgbmV3UG9zaXRpb25NYXAuc2V0KGMsIGMuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xufVxuZnVuY3Rpb24gYXBwbHlUcmFuc2xhdGlvbihjKSB7XG4gIGNvbnN0IG9sZFBvcyA9IHBvc2l0aW9uTWFwLmdldChjKTtcbiAgY29uc3QgbmV3UG9zID0gbmV3UG9zaXRpb25NYXAuZ2V0KGMpO1xuICBjb25zdCBkeCA9IG9sZFBvcy5sZWZ0IC0gbmV3UG9zLmxlZnQ7XG4gIGNvbnN0IGR5ID0gb2xkUG9zLnRvcCAtIG5ld1Bvcy50b3A7XG4gIGlmIChkeCB8fCBkeSkge1xuICAgIGNvbnN0IHMgPSBjLmVsLnN0eWxlO1xuICAgIHMudHJhbnNmb3JtID0gcy53ZWJraXRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7ZHh9cHgsJHtkeX1weClgO1xuICAgIHMudHJhbnNpdGlvbkR1cmF0aW9uID0gXCIwc1wiO1xuICAgIHJldHVybiBjO1xuICB9XG59XG5mdW5jdGlvbiBoYXNDU1NUcmFuc2Zvcm0oZWwsIHJvb3QsIG1vdmVDbGFzcykge1xuICBjb25zdCBjbG9uZSA9IGVsLmNsb25lTm9kZSgpO1xuICBpZiAoZWwuX3Z0Yykge1xuICAgIGVsLl92dGMuZm9yRWFjaCgoY2xzKSA9PiB7XG4gICAgICBjbHMuc3BsaXQoL1xccysvKS5mb3JFYWNoKChjKSA9PiBjICYmIGNsb25lLmNsYXNzTGlzdC5yZW1vdmUoYykpO1xuICAgIH0pO1xuICB9XG4gIG1vdmVDbGFzcy5zcGxpdCgvXFxzKy8pLmZvckVhY2goKGMpID0+IGMgJiYgY2xvbmUuY2xhc3NMaXN0LmFkZChjKSk7XG4gIGNsb25lLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgY29uc3QgY29udGFpbmVyID0gcm9vdC5ub2RlVHlwZSA9PT0gMSA/IHJvb3QgOiByb290LnBhcmVudE5vZGU7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9uZSk7XG4gIGNvbnN0IHsgaGFzVHJhbnNmb3JtIH0gPSBnZXRUcmFuc2l0aW9uSW5mbyhjbG9uZSk7XG4gIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjbG9uZSk7XG4gIHJldHVybiBoYXNUcmFuc2Zvcm07XG59XG5cbmNvbnN0IGdldE1vZGVsQXNzaWduZXIgPSAodm5vZGUpID0+IHtcbiAgY29uc3QgZm4gPSB2bm9kZS5wcm9wc1tcIm9uVXBkYXRlOm1vZGVsVmFsdWVcIl0gfHwgZmFsc2U7XG4gIHJldHVybiBpc0FycmF5KGZuKSA/ICh2YWx1ZSkgPT4gaW52b2tlQXJyYXlGbnMoZm4sIHZhbHVlKSA6IGZuO1xufTtcbmZ1bmN0aW9uIG9uQ29tcG9zaXRpb25TdGFydChlKSB7XG4gIGUudGFyZ2V0LmNvbXBvc2luZyA9IHRydWU7XG59XG5mdW5jdGlvbiBvbkNvbXBvc2l0aW9uRW5kKGUpIHtcbiAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gIGlmICh0YXJnZXQuY29tcG9zaW5nKSB7XG4gICAgdGFyZ2V0LmNvbXBvc2luZyA9IGZhbHNlO1xuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIpKTtcbiAgfVxufVxuY29uc3Qgdk1vZGVsVGV4dCA9IHtcbiAgY3JlYXRlZChlbCwgeyBtb2RpZmllcnM6IHsgbGF6eSwgdHJpbSwgbnVtYmVyIH0gfSwgdm5vZGUpIHtcbiAgICBlbC5fYXNzaWduID0gZ2V0TW9kZWxBc3NpZ25lcih2bm9kZSk7XG4gICAgY29uc3QgY2FzdFRvTnVtYmVyID0gbnVtYmVyIHx8IHZub2RlLnByb3BzICYmIHZub2RlLnByb3BzLnR5cGUgPT09IFwibnVtYmVyXCI7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgbGF6eSA/IFwiY2hhbmdlXCIgOiBcImlucHV0XCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuY29tcG9zaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgICBsZXQgZG9tVmFsdWUgPSBlbC52YWx1ZTtcbiAgICAgIGlmICh0cmltKSB7XG4gICAgICAgIGRvbVZhbHVlID0gZG9tVmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgICAgaWYgKGNhc3RUb051bWJlcikge1xuICAgICAgICBkb21WYWx1ZSA9IGxvb3NlVG9OdW1iZXIoZG9tVmFsdWUpO1xuICAgICAgfVxuICAgICAgZWwuX2Fzc2lnbihkb21WYWx1ZSk7XG4gICAgfSk7XG4gICAgaWYgKHRyaW0pIHtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsIFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgZWwudmFsdWUgPSBlbC52YWx1ZS50cmltKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFsYXp5KSB7XG4gICAgICBhZGRFdmVudExpc3RlbmVyKGVsLCBcImNvbXBvc2l0aW9uc3RhcnRcIiwgb25Db21wb3NpdGlvblN0YXJ0KTtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWwsIFwiY29tcG9zaXRpb25lbmRcIiwgb25Db21wb3NpdGlvbkVuZCk7XG4gICAgICBhZGRFdmVudExpc3RlbmVyKGVsLCBcImNoYW5nZVwiLCBvbkNvbXBvc2l0aW9uRW5kKTtcbiAgICB9XG4gIH0sXG4gIC8vIHNldCB2YWx1ZSBvbiBtb3VudGVkIHNvIGl0J3MgYWZ0ZXIgbWluL21heCBmb3IgdHlwZT1cInJhbmdlXCJcbiAgbW91bnRlZChlbCwgeyB2YWx1ZSB9KSB7XG4gICAgZWwudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xuICB9LFxuICBiZWZvcmVVcGRhdGUoZWwsIHsgdmFsdWUsIG1vZGlmaWVyczogeyBsYXp5LCB0cmltLCBudW1iZXIgfSB9LCB2bm9kZSkge1xuICAgIGVsLl9hc3NpZ24gPSBnZXRNb2RlbEFzc2lnbmVyKHZub2RlKTtcbiAgICBpZiAoZWwuY29tcG9zaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCAmJiBlbC50eXBlICE9PSBcInJhbmdlXCIpIHtcbiAgICAgIGlmIChsYXp5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0cmltICYmIGVsLnZhbHVlLnRyaW0oKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKChudW1iZXIgfHwgZWwudHlwZSA9PT0gXCJudW1iZXJcIikgJiYgbG9vc2VUb051bWJlcihlbC52YWx1ZSkgPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xuICAgIGlmIChlbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIGVsLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG59O1xuY29uc3Qgdk1vZGVsQ2hlY2tib3ggPSB7XG4gIC8vICM0MDk2IGFycmF5IGNoZWNrYm94ZXMgbmVlZCB0byBiZSBkZWVwIHRyYXZlcnNlZFxuICBkZWVwOiB0cnVlLFxuICBjcmVhdGVkKGVsLCBfLCB2bm9kZSkge1xuICAgIGVsLl9hc3NpZ24gPSBnZXRNb2RlbEFzc2lnbmVyKHZub2RlKTtcbiAgICBhZGRFdmVudExpc3RlbmVyKGVsLCBcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbFZhbHVlID0gZWwuX21vZGVsVmFsdWU7XG4gICAgICBjb25zdCBlbGVtZW50VmFsdWUgPSBnZXRWYWx1ZShlbCk7XG4gICAgICBjb25zdCBjaGVja2VkID0gZWwuY2hlY2tlZDtcbiAgICAgIGNvbnN0IGFzc2lnbiA9IGVsLl9hc3NpZ247XG4gICAgICBpZiAoaXNBcnJheShtb2RlbFZhbHVlKSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGxvb3NlSW5kZXhPZihtb2RlbFZhbHVlLCBlbGVtZW50VmFsdWUpO1xuICAgICAgICBjb25zdCBmb3VuZCA9IGluZGV4ICE9PSAtMTtcbiAgICAgICAgaWYgKGNoZWNrZWQgJiYgIWZvdW5kKSB7XG4gICAgICAgICAgYXNzaWduKG1vZGVsVmFsdWUuY29uY2F0KGVsZW1lbnRWYWx1ZSkpO1xuICAgICAgICB9IGVsc2UgaWYgKCFjaGVja2VkICYmIGZvdW5kKSB7XG4gICAgICAgICAgY29uc3QgZmlsdGVyZWQgPSBbLi4ubW9kZWxWYWx1ZV07XG4gICAgICAgICAgZmlsdGVyZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBhc3NpZ24oZmlsdGVyZWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzU2V0KG1vZGVsVmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGNsb25lZCA9IG5ldyBTZXQobW9kZWxWYWx1ZSk7XG4gICAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgICAgY2xvbmVkLmFkZChlbGVtZW50VmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsb25lZC5kZWxldGUoZWxlbWVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NpZ24oY2xvbmVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFzc2lnbihnZXRDaGVja2JveFZhbHVlKGVsLCBjaGVja2VkKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIC8vIHNldCBpbml0aWFsIGNoZWNrZWQgb24gbW91bnQgdG8gd2FpdCBmb3IgdHJ1ZS12YWx1ZS9mYWxzZS12YWx1ZVxuICBtb3VudGVkOiBzZXRDaGVja2VkLFxuICBiZWZvcmVVcGRhdGUoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xuICAgIHNldENoZWNrZWQoZWwsIGJpbmRpbmcsIHZub2RlKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHNldENoZWNrZWQoZWwsIHsgdmFsdWUsIG9sZFZhbHVlIH0sIHZub2RlKSB7XG4gIGVsLl9tb2RlbFZhbHVlID0gdmFsdWU7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGVsLmNoZWNrZWQgPSBsb29zZUluZGV4T2YodmFsdWUsIHZub2RlLnByb3BzLnZhbHVlKSA+IC0xO1xuICB9IGVsc2UgaWYgKGlzU2V0KHZhbHVlKSkge1xuICAgIGVsLmNoZWNrZWQgPSB2YWx1ZS5oYXModm5vZGUucHJvcHMudmFsdWUpO1xuICB9IGVsc2UgaWYgKHZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgIGVsLmNoZWNrZWQgPSBsb29zZUVxdWFsKHZhbHVlLCBnZXRDaGVja2JveFZhbHVlKGVsLCB0cnVlKSk7XG4gIH1cbn1cbmNvbnN0IHZNb2RlbFJhZGlvID0ge1xuICBjcmVhdGVkKGVsLCB7IHZhbHVlIH0sIHZub2RlKSB7XG4gICAgZWwuY2hlY2tlZCA9IGxvb3NlRXF1YWwodmFsdWUsIHZub2RlLnByb3BzLnZhbHVlKTtcbiAgICBlbC5fYXNzaWduID0gZ2V0TW9kZWxBc3NpZ25lcih2bm9kZSk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgZWwuX2Fzc2lnbihnZXRWYWx1ZShlbCkpO1xuICAgIH0pO1xuICB9LFxuICBiZWZvcmVVcGRhdGUoZWwsIHsgdmFsdWUsIG9sZFZhbHVlIH0sIHZub2RlKSB7XG4gICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xuICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgIGVsLmNoZWNrZWQgPSBsb29zZUVxdWFsKHZhbHVlLCB2bm9kZS5wcm9wcy52YWx1ZSk7XG4gICAgfVxuICB9XG59O1xuY29uc3Qgdk1vZGVsU2VsZWN0ID0ge1xuICAvLyA8c2VsZWN0IG11bHRpcGxlPiB2YWx1ZSBuZWVkIHRvIGJlIGRlZXAgdHJhdmVyc2VkXG4gIGRlZXA6IHRydWUsXG4gIGNyZWF0ZWQoZWwsIHsgdmFsdWUsIG1vZGlmaWVyczogeyBudW1iZXIgfSB9LCB2bm9kZSkge1xuICAgIGNvbnN0IGlzU2V0TW9kZWwgPSBpc1NldCh2YWx1ZSk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihlbCwgXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRWYWwgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZWwub3B0aW9ucywgKG8pID0+IG8uc2VsZWN0ZWQpLm1hcChcbiAgICAgICAgKG8pID0+IG51bWJlciA/IGxvb3NlVG9OdW1iZXIoZ2V0VmFsdWUobykpIDogZ2V0VmFsdWUobylcbiAgICAgICk7XG4gICAgICBlbC5fYXNzaWduKFxuICAgICAgICBlbC5tdWx0aXBsZSA/IGlzU2V0TW9kZWwgPyBuZXcgU2V0KHNlbGVjdGVkVmFsKSA6IHNlbGVjdGVkVmFsIDogc2VsZWN0ZWRWYWxbMF1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgZWwuX2Fzc2lnbiA9IGdldE1vZGVsQXNzaWduZXIodm5vZGUpO1xuICB9LFxuICAvLyBzZXQgdmFsdWUgaW4gbW91bnRlZCAmIHVwZGF0ZWQgYmVjYXVzZSA8c2VsZWN0PiByZWxpZXMgb24gaXRzIGNoaWxkcmVuXG4gIC8vIDxvcHRpb24+cy5cbiAgbW91bnRlZChlbCwgeyB2YWx1ZSB9KSB7XG4gICAgc2V0U2VsZWN0ZWQoZWwsIHZhbHVlKTtcbiAgfSxcbiAgYmVmb3JlVXBkYXRlKGVsLCBfYmluZGluZywgdm5vZGUpIHtcbiAgICBlbC5fYXNzaWduID0gZ2V0TW9kZWxBc3NpZ25lcih2bm9kZSk7XG4gIH0sXG4gIHVwZGF0ZWQoZWwsIHsgdmFsdWUgfSkge1xuICAgIHNldFNlbGVjdGVkKGVsLCB2YWx1ZSk7XG4gIH1cbn07XG5mdW5jdGlvbiBzZXRTZWxlY3RlZChlbCwgdmFsdWUpIHtcbiAgY29uc3QgaXNNdWx0aXBsZSA9IGVsLm11bHRpcGxlO1xuICBpZiAoaXNNdWx0aXBsZSAmJiAhaXNBcnJheSh2YWx1ZSkgJiYgIWlzU2V0KHZhbHVlKSkge1xuICAgICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2FybihcbiAgICAgIGA8c2VsZWN0IG11bHRpcGxlIHYtbW9kZWw+IGV4cGVjdHMgYW4gQXJyYXkgb3IgU2V0IHZhbHVlIGZvciBpdHMgYmluZGluZywgYnV0IGdvdCAke09iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpfS5gXG4gICAgKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBlbC5vcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IG9wdGlvbiA9IGVsLm9wdGlvbnNbaV07XG4gICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBnZXRWYWx1ZShvcHRpb24pO1xuICAgIGlmIChpc011bHRpcGxlKSB7XG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gbG9vc2VJbmRleE9mKHZhbHVlLCBvcHRpb25WYWx1ZSkgPiAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHZhbHVlLmhhcyhvcHRpb25WYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChsb29zZUVxdWFsKGdldFZhbHVlKG9wdGlvbiksIHZhbHVlKSkge1xuICAgICAgICBpZiAoZWwuc2VsZWN0ZWRJbmRleCAhPT0gaSlcbiAgICAgICAgICBlbC5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoIWlzTXVsdGlwbGUgJiYgZWwuc2VsZWN0ZWRJbmRleCAhPT0gLTEpIHtcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTE7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFZhbHVlKGVsKSB7XG4gIHJldHVybiBcIl92YWx1ZVwiIGluIGVsID8gZWwuX3ZhbHVlIDogZWwudmFsdWU7XG59XG5mdW5jdGlvbiBnZXRDaGVja2JveFZhbHVlKGVsLCBjaGVja2VkKSB7XG4gIGNvbnN0IGtleSA9IGNoZWNrZWQgPyBcIl90cnVlVmFsdWVcIiA6IFwiX2ZhbHNlVmFsdWVcIjtcbiAgcmV0dXJuIGtleSBpbiBlbCA/IGVsW2tleV0gOiBjaGVja2VkO1xufVxuY29uc3Qgdk1vZGVsRHluYW1pYyA9IHtcbiAgY3JlYXRlZChlbCwgYmluZGluZywgdm5vZGUpIHtcbiAgICBjYWxsTW9kZWxIb29rKGVsLCBiaW5kaW5nLCB2bm9kZSwgbnVsbCwgXCJjcmVhdGVkXCIpO1xuICB9LFxuICBtb3VudGVkKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgIGNhbGxNb2RlbEhvb2soZWwsIGJpbmRpbmcsIHZub2RlLCBudWxsLCBcIm1vdW50ZWRcIik7XG4gIH0sXG4gIGJlZm9yZVVwZGF0ZShlbCwgYmluZGluZywgdm5vZGUsIHByZXZWTm9kZSkge1xuICAgIGNhbGxNb2RlbEhvb2soZWwsIGJpbmRpbmcsIHZub2RlLCBwcmV2Vk5vZGUsIFwiYmVmb3JlVXBkYXRlXCIpO1xuICB9LFxuICB1cGRhdGVkKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlKSB7XG4gICAgY2FsbE1vZGVsSG9vayhlbCwgYmluZGluZywgdm5vZGUsIHByZXZWTm9kZSwgXCJ1cGRhdGVkXCIpO1xuICB9XG59O1xuZnVuY3Rpb24gcmVzb2x2ZUR5bmFtaWNNb2RlbCh0YWdOYW1lLCB0eXBlKSB7XG4gIHN3aXRjaCAodGFnTmFtZSkge1xuICAgIGNhc2UgXCJTRUxFQ1RcIjpcbiAgICAgIHJldHVybiB2TW9kZWxTZWxlY3Q7XG4gICAgY2FzZSBcIlRFWFRBUkVBXCI6XG4gICAgICByZXR1cm4gdk1vZGVsVGV4dDtcbiAgICBkZWZhdWx0OlxuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxuICAgICAgICAgIHJldHVybiB2TW9kZWxDaGVja2JveDtcbiAgICAgICAgY2FzZSBcInJhZGlvXCI6XG4gICAgICAgICAgcmV0dXJuIHZNb2RlbFJhZGlvO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiB2TW9kZWxUZXh0O1xuICAgICAgfVxuICB9XG59XG5mdW5jdGlvbiBjYWxsTW9kZWxIb29rKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlLCBob29rKSB7XG4gIGNvbnN0IG1vZGVsVG9Vc2UgPSByZXNvbHZlRHluYW1pY01vZGVsKFxuICAgIGVsLnRhZ05hbWUsXG4gICAgdm5vZGUucHJvcHMgJiYgdm5vZGUucHJvcHMudHlwZVxuICApO1xuICBjb25zdCBmbiA9IG1vZGVsVG9Vc2VbaG9va107XG4gIGZuICYmIGZuKGVsLCBiaW5kaW5nLCB2bm9kZSwgcHJldlZOb2RlKTtcbn1cbmZ1bmN0aW9uIGluaXRWTW9kZWxGb3JTU1IoKSB7XG4gIHZNb2RlbFRleHQuZ2V0U1NSUHJvcHMgPSAoeyB2YWx1ZSB9KSA9PiAoeyB2YWx1ZSB9KTtcbiAgdk1vZGVsUmFkaW8uZ2V0U1NSUHJvcHMgPSAoeyB2YWx1ZSB9LCB2bm9kZSkgPT4ge1xuICAgIGlmICh2bm9kZS5wcm9wcyAmJiBsb29zZUVxdWFsKHZub2RlLnByb3BzLnZhbHVlLCB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB7IGNoZWNrZWQ6IHRydWUgfTtcbiAgICB9XG4gIH07XG4gIHZNb2RlbENoZWNrYm94LmdldFNTUlByb3BzID0gKHsgdmFsdWUgfSwgdm5vZGUpID0+IHtcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGlmICh2bm9kZS5wcm9wcyAmJiBsb29zZUluZGV4T2YodmFsdWUsIHZub2RlLnByb3BzLnZhbHVlKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IHRydWUgfTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzU2V0KHZhbHVlKSkge1xuICAgICAgaWYgKHZub2RlLnByb3BzICYmIHZhbHVlLmhhcyh2bm9kZS5wcm9wcy52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHsgY2hlY2tlZDogdHJ1ZSB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgIHJldHVybiB7IGNoZWNrZWQ6IHRydWUgfTtcbiAgICB9XG4gIH07XG4gIHZNb2RlbER5bmFtaWMuZ2V0U1NSUHJvcHMgPSAoYmluZGluZywgdm5vZGUpID0+IHtcbiAgICBpZiAodHlwZW9mIHZub2RlLnR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbW9kZWxUb1VzZSA9IHJlc29sdmVEeW5hbWljTW9kZWwoXG4gICAgICAvLyByZXNvbHZlRHluYW1pY01vZGVsIGV4cGVjdHMgYW4gdXBwZXJjYXNlIHRhZyBuYW1lLCBidXQgdm5vZGUudHlwZSBpcyBsb3dlcmNhc2VcbiAgICAgIHZub2RlLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgIHZub2RlLnByb3BzICYmIHZub2RlLnByb3BzLnR5cGVcbiAgICApO1xuICAgIGlmIChtb2RlbFRvVXNlLmdldFNTUlByb3BzKSB7XG4gICAgICByZXR1cm4gbW9kZWxUb1VzZS5nZXRTU1JQcm9wcyhiaW5kaW5nLCB2bm9kZSk7XG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBzeXN0ZW1Nb2RpZmllcnMgPSBbXCJjdHJsXCIsIFwic2hpZnRcIiwgXCJhbHRcIiwgXCJtZXRhXCJdO1xuY29uc3QgbW9kaWZpZXJHdWFyZHMgPSB7XG4gIHN0b3A6IChlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpLFxuICBwcmV2ZW50OiAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpLFxuICBzZWxmOiAoZSkgPT4gZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCxcbiAgY3RybDogKGUpID0+ICFlLmN0cmxLZXksXG4gIHNoaWZ0OiAoZSkgPT4gIWUuc2hpZnRLZXksXG4gIGFsdDogKGUpID0+ICFlLmFsdEtleSxcbiAgbWV0YTogKGUpID0+ICFlLm1ldGFLZXksXG4gIGxlZnQ6IChlKSA9PiBcImJ1dHRvblwiIGluIGUgJiYgZS5idXR0b24gIT09IDAsXG4gIG1pZGRsZTogKGUpID0+IFwiYnV0dG9uXCIgaW4gZSAmJiBlLmJ1dHRvbiAhPT0gMSxcbiAgcmlnaHQ6IChlKSA9PiBcImJ1dHRvblwiIGluIGUgJiYgZS5idXR0b24gIT09IDIsXG4gIGV4YWN0OiAoZSwgbW9kaWZpZXJzKSA9PiBzeXN0ZW1Nb2RpZmllcnMuc29tZSgobSkgPT4gZVtgJHttfUtleWBdICYmICFtb2RpZmllcnMuaW5jbHVkZXMobSkpXG59O1xuY29uc3Qgd2l0aE1vZGlmaWVycyA9IChmbiwgbW9kaWZpZXJzKSA9PiB7XG4gIHJldHVybiAoZXZlbnQsIC4uLmFyZ3MpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ3VhcmQgPSBtb2RpZmllckd1YXJkc1ttb2RpZmllcnNbaV1dO1xuICAgICAgaWYgKGd1YXJkICYmIGd1YXJkKGV2ZW50LCBtb2RpZmllcnMpKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBmbihldmVudCwgLi4uYXJncyk7XG4gIH07XG59O1xuY29uc3Qga2V5TmFtZXMgPSB7XG4gIGVzYzogXCJlc2NhcGVcIixcbiAgc3BhY2U6IFwiIFwiLFxuICB1cDogXCJhcnJvdy11cFwiLFxuICBsZWZ0OiBcImFycm93LWxlZnRcIixcbiAgcmlnaHQ6IFwiYXJyb3ctcmlnaHRcIixcbiAgZG93bjogXCJhcnJvdy1kb3duXCIsXG4gIGRlbGV0ZTogXCJiYWNrc3BhY2VcIlxufTtcbmNvbnN0IHdpdGhLZXlzID0gKGZuLCBtb2RpZmllcnMpID0+IHtcbiAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgIGlmICghKFwia2V5XCIgaW4gZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50S2V5ID0gaHlwaGVuYXRlKGV2ZW50LmtleSk7XG4gICAgaWYgKG1vZGlmaWVycy5zb21lKChrKSA9PiBrID09PSBldmVudEtleSB8fCBrZXlOYW1lc1trXSA9PT0gZXZlbnRLZXkpKSB7XG4gICAgICByZXR1cm4gZm4oZXZlbnQpO1xuICAgIH1cbiAgfTtcbn07XG5cbmNvbnN0IHZTaG93ID0ge1xuICBiZWZvcmVNb3VudChlbCwgeyB2YWx1ZSB9LCB7IHRyYW5zaXRpb24gfSkge1xuICAgIGVsLl92b2QgPSBlbC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIiA/IFwiXCIgOiBlbC5zdHlsZS5kaXNwbGF5O1xuICAgIGlmICh0cmFuc2l0aW9uICYmIHZhbHVlKSB7XG4gICAgICB0cmFuc2l0aW9uLmJlZm9yZUVudGVyKGVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0RGlzcGxheShlbCwgdmFsdWUpO1xuICAgIH1cbiAgfSxcbiAgbW91bnRlZChlbCwgeyB2YWx1ZSB9LCB7IHRyYW5zaXRpb24gfSkge1xuICAgIGlmICh0cmFuc2l0aW9uICYmIHZhbHVlKSB7XG4gICAgICB0cmFuc2l0aW9uLmVudGVyKGVsKTtcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZWQoZWwsIHsgdmFsdWUsIG9sZFZhbHVlIH0sIHsgdHJhbnNpdGlvbiB9KSB7XG4gICAgaWYgKCF2YWx1ZSA9PT0gIW9sZFZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdHJhbnNpdGlvbi5iZWZvcmVFbnRlcihlbCk7XG4gICAgICAgIHNldERpc3BsYXkoZWwsIHRydWUpO1xuICAgICAgICB0cmFuc2l0aW9uLmVudGVyKGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYW5zaXRpb24ubGVhdmUoZWwsICgpID0+IHtcbiAgICAgICAgICBzZXREaXNwbGF5KGVsLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZXREaXNwbGF5KGVsLCB2YWx1ZSk7XG4gICAgfVxuICB9LFxuICBiZWZvcmVVbm1vdW50KGVsLCB7IHZhbHVlIH0pIHtcbiAgICBzZXREaXNwbGF5KGVsLCB2YWx1ZSk7XG4gIH1cbn07XG5mdW5jdGlvbiBzZXREaXNwbGF5KGVsLCB2YWx1ZSkge1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyBlbC5fdm9kIDogXCJub25lXCI7XG59XG5mdW5jdGlvbiBpbml0VlNob3dGb3JTU1IoKSB7XG4gIHZTaG93LmdldFNTUlByb3BzID0gKHsgdmFsdWUgfSkgPT4ge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHJldHVybiB7IHN0eWxlOiB7IGRpc3BsYXk6IFwibm9uZVwiIH0gfTtcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHJlbmRlcmVyT3B0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBleHRlbmQoeyBwYXRjaFByb3AgfSwgbm9kZU9wcyk7XG5sZXQgcmVuZGVyZXI7XG5sZXQgZW5hYmxlZEh5ZHJhdGlvbiA9IGZhbHNlO1xuZnVuY3Rpb24gZW5zdXJlUmVuZGVyZXIoKSB7XG4gIHJldHVybiByZW5kZXJlciB8fCAocmVuZGVyZXIgPSBjcmVhdGVSZW5kZXJlcihyZW5kZXJlck9wdGlvbnMpKTtcbn1cbmZ1bmN0aW9uIGVuc3VyZUh5ZHJhdGlvblJlbmRlcmVyKCkge1xuICByZW5kZXJlciA9IGVuYWJsZWRIeWRyYXRpb24gPyByZW5kZXJlciA6IGNyZWF0ZUh5ZHJhdGlvblJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gIGVuYWJsZWRIeWRyYXRpb24gPSB0cnVlO1xuICByZXR1cm4gcmVuZGVyZXI7XG59XG5jb25zdCByZW5kZXIgPSAoLi4uYXJncykgPT4ge1xuICBlbnN1cmVSZW5kZXJlcigpLnJlbmRlciguLi5hcmdzKTtcbn07XG5jb25zdCBoeWRyYXRlID0gKC4uLmFyZ3MpID0+IHtcbiAgZW5zdXJlSHlkcmF0aW9uUmVuZGVyZXIoKS5oeWRyYXRlKC4uLmFyZ3MpO1xufTtcbmNvbnN0IGNyZWF0ZUFwcCA9ICguLi5hcmdzKSA9PiB7XG4gIGNvbnN0IGFwcCA9IGVuc3VyZVJlbmRlcmVyKCkuY3JlYXRlQXBwKC4uLmFyZ3MpO1xuICBpZiAoISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSkge1xuICAgIGluamVjdE5hdGl2ZVRhZ0NoZWNrKGFwcCk7XG4gICAgaW5qZWN0Q29tcGlsZXJPcHRpb25zQ2hlY2soYXBwKTtcbiAgfVxuICBjb25zdCB7IG1vdW50IH0gPSBhcHA7XG4gIGFwcC5tb3VudCA9IChjb250YWluZXJPclNlbGVjdG9yKSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gbm9ybWFsaXplQ29udGFpbmVyKGNvbnRhaW5lck9yU2VsZWN0b3IpO1xuICAgIGlmICghY29udGFpbmVyKVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGFwcC5fY29tcG9uZW50O1xuICAgIGlmICghaXNGdW5jdGlvbihjb21wb25lbnQpICYmICFjb21wb25lbnQucmVuZGVyICYmICFjb21wb25lbnQudGVtcGxhdGUpIHtcbiAgICAgIGNvbXBvbmVudC50ZW1wbGF0ZSA9IGNvbnRhaW5lci5pbm5lckhUTUw7XG4gICAgfVxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGNvbnN0IHByb3h5ID0gbW91bnQoY29udGFpbmVyLCBmYWxzZSwgY29udGFpbmVyIGluc3RhbmNlb2YgU1ZHRWxlbWVudCk7XG4gICAgaWYgKGNvbnRhaW5lciBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoXCJ2LWNsb2FrXCIpO1xuICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImRhdGEtdi1hcHBcIiwgXCJcIik7XG4gICAgfVxuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcmV0dXJuIGFwcDtcbn07XG5jb25zdCBjcmVhdGVTU1JBcHAgPSAoLi4uYXJncykgPT4ge1xuICBjb25zdCBhcHAgPSBlbnN1cmVIeWRyYXRpb25SZW5kZXJlcigpLmNyZWF0ZUFwcCguLi5hcmdzKTtcbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikpIHtcbiAgICBpbmplY3ROYXRpdmVUYWdDaGVjayhhcHApO1xuICAgIGluamVjdENvbXBpbGVyT3B0aW9uc0NoZWNrKGFwcCk7XG4gIH1cbiAgY29uc3QgeyBtb3VudCB9ID0gYXBwO1xuICBhcHAubW91bnQgPSAoY29udGFpbmVyT3JTZWxlY3RvcikgPT4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5vcm1hbGl6ZUNvbnRhaW5lcihjb250YWluZXJPclNlbGVjdG9yKTtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gbW91bnQoY29udGFpbmVyLCB0cnVlLCBjb250YWluZXIgaW5zdGFuY2VvZiBTVkdFbGVtZW50KTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBhcHA7XG59O1xuZnVuY3Rpb24gaW5qZWN0TmF0aXZlVGFnQ2hlY2soYXBwKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcHAuY29uZmlnLCBcImlzTmF0aXZlVGFnXCIsIHtcbiAgICB2YWx1ZTogKHRhZykgPT4gaXNIVE1MVGFnKHRhZykgfHwgaXNTVkdUYWcodGFnKSxcbiAgICB3cml0YWJsZTogZmFsc2VcbiAgfSk7XG59XG5mdW5jdGlvbiBpbmplY3RDb21waWxlck9wdGlvbnNDaGVjayhhcHApIHtcbiAgaWYgKGlzUnVudGltZU9ubHkoKSkge1xuICAgIGNvbnN0IGlzQ3VzdG9tRWxlbWVudCA9IGFwcC5jb25maWcuaXNDdXN0b21FbGVtZW50O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcHAuY29uZmlnLCBcImlzQ3VzdG9tRWxlbWVudFwiLCB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIHJldHVybiBpc0N1c3RvbUVsZW1lbnQ7XG4gICAgICB9LFxuICAgICAgc2V0KCkge1xuICAgICAgICB3YXJuKFxuICAgICAgICAgIGBUaGUgXFxgaXNDdXN0b21FbGVtZW50XFxgIGNvbmZpZyBvcHRpb24gaXMgZGVwcmVjYXRlZC4gVXNlIFxcYGNvbXBpbGVyT3B0aW9ucy5pc0N1c3RvbUVsZW1lbnRcXGAgaW5zdGVhZC5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY29tcGlsZXJPcHRpb25zID0gYXBwLmNvbmZpZy5jb21waWxlck9wdGlvbnM7XG4gICAgY29uc3QgbXNnID0gYFRoZSBcXGBjb21waWxlck9wdGlvbnNcXGAgY29uZmlnIG9wdGlvbiBpcyBvbmx5IHJlc3BlY3RlZCB3aGVuIHVzaW5nIGEgYnVpbGQgb2YgVnVlLmpzIHRoYXQgaW5jbHVkZXMgdGhlIHJ1bnRpbWUgY29tcGlsZXIgKGFrYSBcImZ1bGwgYnVpbGRcIikuIFNpbmNlIHlvdSBhcmUgdXNpbmcgdGhlIHJ1bnRpbWUtb25seSBidWlsZCwgXFxgY29tcGlsZXJPcHRpb25zXFxgIG11c3QgYmUgcGFzc2VkIHRvIFxcYEB2dWUvY29tcGlsZXItZG9tXFxgIGluIHRoZSBidWlsZCBzZXR1cCBpbnN0ZWFkLlxuLSBGb3IgdnVlLWxvYWRlcjogcGFzcyBpdCB2aWEgdnVlLWxvYWRlcidzIFxcYGNvbXBpbGVyT3B0aW9uc1xcYCBsb2FkZXIgb3B0aW9uLlxuLSBGb3IgdnVlLWNsaTogc2VlIGh0dHBzOi8vY2xpLnZ1ZWpzLm9yZy9ndWlkZS93ZWJwYWNrLmh0bWwjbW9kaWZ5aW5nLW9wdGlvbnMtb2YtYS1sb2FkZXJcbi0gRm9yIHZpdGU6IHBhc3MgaXQgdmlhIEB2aXRlanMvcGx1Z2luLXZ1ZSBvcHRpb25zLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlLXBsdWdpbi12dWUvdHJlZS9tYWluL3BhY2thZ2VzL3BsdWdpbi12dWUjZXhhbXBsZS1mb3ItcGFzc2luZy1vcHRpb25zLXRvLXZ1ZWNvbXBpbGVyLXNmY2A7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFwcC5jb25maWcsIFwiY29tcGlsZXJPcHRpb25zXCIsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgd2Fybihtc2cpO1xuICAgICAgICByZXR1cm4gY29tcGlsZXJPcHRpb25zO1xuICAgICAgfSxcbiAgICAgIHNldCgpIHtcbiAgICAgICAgd2Fybihtc2cpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5mdW5jdGlvbiBub3JtYWxpemVDb250YWluZXIoY29udGFpbmVyKSB7XG4gIGlmIChpc1N0cmluZyhjb250YWluZXIpKSB7XG4gICAgY29uc3QgcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpICYmICFyZXMpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBGYWlsZWQgdG8gbW91bnQgYXBwOiBtb3VudCB0YXJnZXQgc2VsZWN0b3IgXCIke2NvbnRhaW5lcn1cIiByZXR1cm5lZCBudWxsLmBcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cbiAgaWYgKCEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgJiYgd2luZG93LlNoYWRvd1Jvb3QgJiYgY29udGFpbmVyIGluc3RhbmNlb2Ygd2luZG93LlNoYWRvd1Jvb3QgJiYgY29udGFpbmVyLm1vZGUgPT09IFwiY2xvc2VkXCIpIHtcbiAgICB3YXJuKFxuICAgICAgYG1vdW50aW5nIG9uIGEgU2hhZG93Um9vdCB3aXRoIFxcYHttb2RlOiBcImNsb3NlZFwifVxcYCBtYXkgbGVhZCB0byB1bnByZWRpY3RhYmxlIGJ1Z3NgXG4gICAgKTtcbiAgfVxuICByZXR1cm4gY29udGFpbmVyO1xufVxubGV0IHNzckRpcmVjdGl2ZUluaXRpYWxpemVkID0gZmFsc2U7XG5jb25zdCBpbml0RGlyZWN0aXZlc0ZvclNTUiA9ICgpID0+IHtcbiAgaWYgKCFzc3JEaXJlY3RpdmVJbml0aWFsaXplZCkge1xuICAgIHNzckRpcmVjdGl2ZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICBpbml0Vk1vZGVsRm9yU1NSKCk7XG4gICAgaW5pdFZTaG93Rm9yU1NSKCk7XG4gIH1cbn0gO1xuXG5leHBvcnQgeyBUcmFuc2l0aW9uLCBUcmFuc2l0aW9uR3JvdXAsIFZ1ZUVsZW1lbnQsIGNyZWF0ZUFwcCwgY3JlYXRlU1NSQXBwLCBkZWZpbmVDdXN0b21FbGVtZW50LCBkZWZpbmVTU1JDdXN0b21FbGVtZW50LCBoeWRyYXRlLCBpbml0RGlyZWN0aXZlc0ZvclNTUiwgcmVuZGVyLCB1c2VDc3NNb2R1bGUsIHVzZUNzc1ZhcnMsIHZNb2RlbENoZWNrYm94LCB2TW9kZWxEeW5hbWljLCB2TW9kZWxSYWRpbywgdk1vZGVsU2VsZWN0LCB2TW9kZWxUZXh0LCB2U2hvdywgd2l0aEtleXMsIHdpdGhNb2RpZmllcnMgfTtcbiIsImZ1bmN0aW9uIG1ha2VNYXAoc3RyLCBleHBlY3RzTG93ZXJDYXNlKSB7XG4gIGNvbnN0IG1hcCA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCBsaXN0ID0gc3RyLnNwbGl0KFwiLFwiKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbWFwW2xpc3RbaV1dID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZXhwZWN0c0xvd2VyQ2FzZSA/ICh2YWwpID0+ICEhbWFwW3ZhbC50b0xvd2VyQ2FzZSgpXSA6ICh2YWwpID0+ICEhbWFwW3ZhbF07XG59XG5cbmNvbnN0IEVNUFRZX09CSiA9ICEhKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikgPyBPYmplY3QuZnJlZXplKHt9KSA6IHt9O1xuY29uc3QgRU1QVFlfQVJSID0gISEocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSA/IE9iamVjdC5mcmVlemUoW10pIDogW107XG5jb25zdCBOT09QID0gKCkgPT4ge1xufTtcbmNvbnN0IE5PID0gKCkgPT4gZmFsc2U7XG5jb25zdCBvblJFID0gL15vblteYS16XS87XG5jb25zdCBpc09uID0gKGtleSkgPT4gb25SRS50ZXN0KGtleSk7XG5jb25zdCBpc01vZGVsTGlzdGVuZXIgPSAoa2V5KSA9PiBrZXkuc3RhcnRzV2l0aChcIm9uVXBkYXRlOlwiKTtcbmNvbnN0IGV4dGVuZCA9IE9iamVjdC5hc3NpZ247XG5jb25zdCByZW1vdmUgPSAoYXJyLCBlbCkgPT4ge1xuICBjb25zdCBpID0gYXJyLmluZGV4T2YoZWwpO1xuICBpZiAoaSA+IC0xKSB7XG4gICAgYXJyLnNwbGljZShpLCAxKTtcbiAgfVxufTtcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmNvbnN0IGhhc093biA9ICh2YWwsIGtleSkgPT4gaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIGtleSk7XG5jb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbmNvbnN0IGlzTWFwID0gKHZhbCkgPT4gdG9UeXBlU3RyaW5nKHZhbCkgPT09IFwiW29iamVjdCBNYXBdXCI7XG5jb25zdCBpc1NldCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgU2V0XVwiO1xuY29uc3QgaXNEYXRlID0gKHZhbCkgPT4gdG9UeXBlU3RyaW5nKHZhbCkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xuY29uc3QgaXNSZWdFeHAgPSAodmFsKSA9PiB0b1R5cGVTdHJpbmcodmFsKSA9PT0gXCJbb2JqZWN0IFJlZ0V4cF1cIjtcbmNvbnN0IGlzRnVuY3Rpb24gPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCI7XG5jb25zdCBpc1N0cmluZyA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCI7XG5jb25zdCBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3ltYm9sXCI7XG5jb25zdCBpc09iamVjdCA9ICh2YWwpID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiO1xuY29uc3QgaXNQcm9taXNlID0gKHZhbCkgPT4ge1xuICByZXR1cm4gaXNPYmplY3QodmFsKSAmJiBpc0Z1bmN0aW9uKHZhbC50aGVuKSAmJiBpc0Z1bmN0aW9uKHZhbC5jYXRjaCk7XG59O1xuY29uc3Qgb2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbmNvbnN0IHRvUmF3VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICByZXR1cm4gdG9UeXBlU3RyaW5nKHZhbHVlKS5zbGljZSg4LCAtMSk7XG59O1xuY29uc3QgaXNQbGFpbk9iamVjdCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuY29uc3QgaXNJbnRlZ2VyS2V5ID0gKGtleSkgPT4gaXNTdHJpbmcoa2V5KSAmJiBrZXkgIT09IFwiTmFOXCIgJiYga2V5WzBdICE9PSBcIi1cIiAmJiBcIlwiICsgcGFyc2VJbnQoa2V5LCAxMCkgPT09IGtleTtcbmNvbnN0IGlzUmVzZXJ2ZWRQcm9wID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoXG4gIC8vIHRoZSBsZWFkaW5nIGNvbW1hIGlzIGludGVudGlvbmFsIHNvIGVtcHR5IHN0cmluZyBcIlwiIGlzIGFsc28gaW5jbHVkZWRcbiAgXCIsa2V5LHJlZixyZWZfZm9yLHJlZl9rZXksb25Wbm9kZUJlZm9yZU1vdW50LG9uVm5vZGVNb3VudGVkLG9uVm5vZGVCZWZvcmVVcGRhdGUsb25Wbm9kZVVwZGF0ZWQsb25Wbm9kZUJlZm9yZVVubW91bnQsb25Wbm9kZVVubW91bnRlZFwiXG4pO1xuY29uc3QgaXNCdWlsdEluRGlyZWN0aXZlID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoXG4gIFwiYmluZCxjbG9hayxlbHNlLWlmLGVsc2UsZm9yLGh0bWwsaWYsbW9kZWwsb24sb25jZSxwcmUsc2hvdyxzbG90LHRleHQsbWVtb1wiXG4pO1xuY29uc3QgY2FjaGVTdHJpbmdGdW5jdGlvbiA9IChmbikgPT4ge1xuICBjb25zdCBjYWNoZSA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICByZXR1cm4gKHN0cikgPT4ge1xuICAgIGNvbnN0IGhpdCA9IGNhY2hlW3N0cl07XG4gICAgcmV0dXJuIGhpdCB8fCAoY2FjaGVbc3RyXSA9IGZuKHN0cikpO1xuICB9O1xufTtcbmNvbnN0IGNhbWVsaXplUkUgPSAvLShcXHcpL2c7XG5jb25zdCBjYW1lbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgKF8sIGMpID0+IGMgPyBjLnRvVXBwZXJDYXNlKCkgOiBcIlwiKTtcbn0pO1xuY29uc3QgaHlwaGVuYXRlUkUgPSAvXFxCKFtBLVpdKS9nO1xuY29uc3QgaHlwaGVuYXRlID0gY2FjaGVTdHJpbmdGdW5jdGlvbihcbiAgKHN0cikgPT4gc3RyLnJlcGxhY2UoaHlwaGVuYXRlUkUsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKClcbik7XG5jb25zdCBjYXBpdGFsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbihcbiAgKHN0cikgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXG4pO1xuY29uc3QgdG9IYW5kbGVyS2V5ID0gY2FjaGVTdHJpbmdGdW5jdGlvbihcbiAgKHN0cikgPT4gc3RyID8gYG9uJHtjYXBpdGFsaXplKHN0cil9YCA6IGBgXG4pO1xuY29uc3QgaGFzQ2hhbmdlZCA9ICh2YWx1ZSwgb2xkVmFsdWUpID0+ICFPYmplY3QuaXModmFsdWUsIG9sZFZhbHVlKTtcbmNvbnN0IGludm9rZUFycmF5Rm5zID0gKGZucywgYXJnKSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgZm5zW2ldKGFyZyk7XG4gIH1cbn07XG5jb25zdCBkZWYgPSAob2JqLCBrZXksIHZhbHVlKSA9PiB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZVxuICB9KTtcbn07XG5jb25zdCBsb29zZVRvTnVtYmVyID0gKHZhbCkgPT4ge1xuICBjb25zdCBuID0gcGFyc2VGbG9hdCh2YWwpO1xuICByZXR1cm4gaXNOYU4obikgPyB2YWwgOiBuO1xufTtcbmNvbnN0IHRvTnVtYmVyID0gKHZhbCkgPT4ge1xuICBjb25zdCBuID0gaXNTdHJpbmcodmFsKSA/IE51bWJlcih2YWwpIDogTmFOO1xuICByZXR1cm4gaXNOYU4obikgPyB2YWwgOiBuO1xufTtcbmxldCBfZ2xvYmFsVGhpcztcbmNvbnN0IGdldEdsb2JhbFRoaXMgPSAoKSA9PiB7XG4gIHJldHVybiBfZ2xvYmFsVGhpcyB8fCAoX2dsb2JhbFRoaXMgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHt9KTtcbn07XG5jb25zdCBpZGVudFJFID0gL15bXyRhLXpBLVpcXHhBMC1cXHVGRkZGXVtfJGEtekEtWjAtOVxceEEwLVxcdUZGRkZdKiQvO1xuZnVuY3Rpb24gZ2VuUHJvcHNBY2Nlc3NFeHAobmFtZSkge1xuICByZXR1cm4gaWRlbnRSRS50ZXN0KG5hbWUpID8gYF9fcHJvcHMuJHtuYW1lfWAgOiBgX19wcm9wc1ske0pTT04uc3RyaW5naWZ5KG5hbWUpfV1gO1xufVxuXG5jb25zdCBQYXRjaEZsYWdOYW1lcyA9IHtcbiAgWzFdOiBgVEVYVGAsXG4gIFsyXTogYENMQVNTYCxcbiAgWzRdOiBgU1RZTEVgLFxuICBbOF06IGBQUk9QU2AsXG4gIFsxNl06IGBGVUxMX1BST1BTYCxcbiAgWzMyXTogYEhZRFJBVEVfRVZFTlRTYCxcbiAgWzY0XTogYFNUQUJMRV9GUkFHTUVOVGAsXG4gIFsxMjhdOiBgS0VZRURfRlJBR01FTlRgLFxuICBbMjU2XTogYFVOS0VZRURfRlJBR01FTlRgLFxuICBbNTEyXTogYE5FRURfUEFUQ0hgLFxuICBbMTAyNF06IGBEWU5BTUlDX1NMT1RTYCxcbiAgWzIwNDhdOiBgREVWX1JPT1RfRlJBR01FTlRgLFxuICBbLTFdOiBgSE9JU1RFRGAsXG4gIFstMl06IGBCQUlMYFxufTtcblxuY29uc3Qgc2xvdEZsYWdzVGV4dCA9IHtcbiAgWzFdOiBcIlNUQUJMRVwiLFxuICBbMl06IFwiRFlOQU1JQ1wiLFxuICBbM106IFwiRk9SV0FSREVEXCJcbn07XG5cbmNvbnN0IEdMT0JBTFNfV0hJVEVfTElTVEVEID0gXCJJbmZpbml0eSx1bmRlZmluZWQsTmFOLGlzRmluaXRlLGlzTmFOLHBhcnNlRmxvYXQscGFyc2VJbnQsZGVjb2RlVVJJLGRlY29kZVVSSUNvbXBvbmVudCxlbmNvZGVVUkksZW5jb2RlVVJJQ29tcG9uZW50LE1hdGgsTnVtYmVyLERhdGUsQXJyYXksT2JqZWN0LEJvb2xlYW4sU3RyaW5nLFJlZ0V4cCxNYXAsU2V0LEpTT04sSW50bCxCaWdJbnQsY29uc29sZVwiO1xuY29uc3QgaXNHbG9iYWxseVdoaXRlbGlzdGVkID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoR0xPQkFMU19XSElURV9MSVNURUQpO1xuXG5jb25zdCByYW5nZSA9IDI7XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGVGcmFtZShzb3VyY2UsIHN0YXJ0ID0gMCwgZW5kID0gc291cmNlLmxlbmd0aCkge1xuICBsZXQgbGluZXMgPSBzb3VyY2Uuc3BsaXQoLyhcXHI/XFxuKS8pO1xuICBjb25zdCBuZXdsaW5lU2VxdWVuY2VzID0gbGluZXMuZmlsdGVyKChfLCBpZHgpID0+IGlkeCAlIDIgPT09IDEpO1xuICBsaW5lcyA9IGxpbmVzLmZpbHRlcigoXywgaWR4KSA9PiBpZHggJSAyID09PSAwKTtcbiAgbGV0IGNvdW50ID0gMDtcbiAgY29uc3QgcmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb3VudCArPSBsaW5lc1tpXS5sZW5ndGggKyAobmV3bGluZVNlcXVlbmNlc1tpXSAmJiBuZXdsaW5lU2VxdWVuY2VzW2ldLmxlbmd0aCB8fCAwKTtcbiAgICBpZiAoY291bnQgPj0gc3RhcnQpIHtcbiAgICAgIGZvciAobGV0IGogPSBpIC0gcmFuZ2U7IGogPD0gaSArIHJhbmdlIHx8IGVuZCA+IGNvdW50OyBqKyspIHtcbiAgICAgICAgaWYgKGogPCAwIHx8IGogPj0gbGluZXMubGVuZ3RoKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBsaW5lID0gaiArIDE7XG4gICAgICAgIHJlcy5wdXNoKFxuICAgICAgICAgIGAke2xpbmV9JHtcIiBcIi5yZXBlYXQoTWF0aC5tYXgoMyAtIFN0cmluZyhsaW5lKS5sZW5ndGgsIDApKX18ICAke2xpbmVzW2pdfWBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbGluZUxlbmd0aCA9IGxpbmVzW2pdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgbmV3TGluZVNlcUxlbmd0aCA9IG5ld2xpbmVTZXF1ZW5jZXNbal0gJiYgbmV3bGluZVNlcXVlbmNlc1tqXS5sZW5ndGggfHwgMDtcbiAgICAgICAgaWYgKGogPT09IGkpIHtcbiAgICAgICAgICBjb25zdCBwYWQgPSBzdGFydCAtIChjb3VudCAtIChsaW5lTGVuZ3RoICsgbmV3TGluZVNlcUxlbmd0aCkpO1xuICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGVuZCA+IGNvdW50ID8gbGluZUxlbmd0aCAtIHBhZCA6IGVuZCAtIHN0YXJ0XG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXMucHVzaChgICAgfCAgYCArIFwiIFwiLnJlcGVhdChwYWQpICsgXCJeXCIucmVwZWF0KGxlbmd0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGogPiBpKSB7XG4gICAgICAgICAgaWYgKGVuZCA+IGNvdW50KSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1heChNYXRoLm1pbihlbmQgLSBjb3VudCwgbGluZUxlbmd0aCksIDEpO1xuICAgICAgICAgICAgcmVzLnB1c2goYCAgIHwgIGAgKyBcIl5cIi5yZXBlYXQobGVuZ3RoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50ICs9IGxpbmVMZW5ndGggKyBuZXdMaW5lU2VxTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcy5qb2luKFwiXFxuXCIpO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVTdHlsZSh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBjb25zdCByZXMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gdmFsdWVbaV07XG4gICAgICBjb25zdCBub3JtYWxpemVkID0gaXNTdHJpbmcoaXRlbSkgPyBwYXJzZVN0cmluZ1N0eWxlKGl0ZW0pIDogbm9ybWFsaXplU3R5bGUoaXRlbSk7XG4gICAgICBpZiAobm9ybWFsaXplZCkge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBub3JtYWxpemVkKSB7XG4gICAgICAgICAgcmVzW2tleV0gPSBub3JtYWxpemVkW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5jb25zdCBsaXN0RGVsaW1pdGVyUkUgPSAvOyg/IVteKF0qXFwpKS9nO1xuY29uc3QgcHJvcGVydHlEZWxpbWl0ZXJSRSA9IC86KFteXSspLztcbmNvbnN0IHN0eWxlQ29tbWVudFJFID0gL1xcL1xcKlteXSo/XFwqXFwvL2c7XG5mdW5jdGlvbiBwYXJzZVN0cmluZ1N0eWxlKGNzc1RleHQpIHtcbiAgY29uc3QgcmV0ID0ge307XG4gIGNzc1RleHQucmVwbGFjZShzdHlsZUNvbW1lbnRSRSwgXCJcIikuc3BsaXQobGlzdERlbGltaXRlclJFKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGNvbnN0IHRtcCA9IGl0ZW0uc3BsaXQocHJvcGVydHlEZWxpbWl0ZXJSRSk7XG4gICAgICB0bXAubGVuZ3RoID4gMSAmJiAocmV0W3RtcFswXS50cmltKCldID0gdG1wWzFdLnRyaW0oKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJldDtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0eWxlKHN0eWxlcykge1xuICBsZXQgcmV0ID0gXCJcIjtcbiAgaWYgKCFzdHlsZXMgfHwgaXNTdHJpbmcoc3R5bGVzKSkge1xuICAgIHJldHVybiByZXQ7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gc3R5bGVzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBzdHlsZXNba2V5XTtcbiAgICBjb25zdCBub3JtYWxpemVkS2V5ID0ga2V5LnN0YXJ0c1dpdGgoYC0tYCkgPyBrZXkgOiBoeXBoZW5hdGUoa2V5KTtcbiAgICBpZiAoaXNTdHJpbmcodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0ICs9IGAke25vcm1hbGl6ZWRLZXl9OiR7dmFsdWV9O2A7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBub3JtYWxpemVDbGFzcyh2YWx1ZSkge1xuICBsZXQgcmVzID0gXCJcIjtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHJlcyA9IHZhbHVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZUNsYXNzKHZhbHVlW2ldKTtcbiAgICAgIGlmIChub3JtYWxpemVkKSB7XG4gICAgICAgIHJlcyArPSBub3JtYWxpemVkICsgXCIgXCI7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiB2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlW25hbWVdKSB7XG4gICAgICAgIHJlcyArPSBuYW1lICsgXCIgXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXMudHJpbSgpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplUHJvcHMocHJvcHMpIHtcbiAgaWYgKCFwcm9wcylcbiAgICByZXR1cm4gbnVsbDtcbiAgbGV0IHsgY2xhc3M6IGtsYXNzLCBzdHlsZSB9ID0gcHJvcHM7XG4gIGlmIChrbGFzcyAmJiAhaXNTdHJpbmcoa2xhc3MpKSB7XG4gICAgcHJvcHMuY2xhc3MgPSBub3JtYWxpemVDbGFzcyhrbGFzcyk7XG4gIH1cbiAgaWYgKHN0eWxlKSB7XG4gICAgcHJvcHMuc3R5bGUgPSBub3JtYWxpemVTdHlsZShzdHlsZSk7XG4gIH1cbiAgcmV0dXJuIHByb3BzO1xufVxuXG5jb25zdCBIVE1MX1RBR1MgPSBcImh0bWwsYm9keSxiYXNlLGhlYWQsbGluayxtZXRhLHN0eWxlLHRpdGxlLGFkZHJlc3MsYXJ0aWNsZSxhc2lkZSxmb290ZXIsaGVhZGVyLGhncm91cCxoMSxoMixoMyxoNCxoNSxoNixuYXYsc2VjdGlvbixkaXYsZGQsZGwsZHQsZmlnY2FwdGlvbixmaWd1cmUscGljdHVyZSxocixpbWcsbGksbWFpbixvbCxwLHByZSx1bCxhLGIsYWJicixiZGksYmRvLGJyLGNpdGUsY29kZSxkYXRhLGRmbixlbSxpLGtiZCxtYXJrLHEscnAscnQscnVieSxzLHNhbXAsc21hbGwsc3BhbixzdHJvbmcsc3ViLHN1cCx0aW1lLHUsdmFyLHdicixhcmVhLGF1ZGlvLG1hcCx0cmFjayx2aWRlbyxlbWJlZCxvYmplY3QscGFyYW0sc291cmNlLGNhbnZhcyxzY3JpcHQsbm9zY3JpcHQsZGVsLGlucyxjYXB0aW9uLGNvbCxjb2xncm91cCx0YWJsZSx0aGVhZCx0Ym9keSx0ZCx0aCx0cixidXR0b24sZGF0YWxpc3QsZmllbGRzZXQsZm9ybSxpbnB1dCxsYWJlbCxsZWdlbmQsbWV0ZXIsb3B0Z3JvdXAsb3B0aW9uLG91dHB1dCxwcm9ncmVzcyxzZWxlY3QsdGV4dGFyZWEsZGV0YWlscyxkaWFsb2csbWVudSxzdW1tYXJ5LHRlbXBsYXRlLGJsb2NrcXVvdGUsaWZyYW1lLHRmb290XCI7XG5jb25zdCBTVkdfVEFHUyA9IFwic3ZnLGFuaW1hdGUsYW5pbWF0ZU1vdGlvbixhbmltYXRlVHJhbnNmb3JtLGNpcmNsZSxjbGlwUGF0aCxjb2xvci1wcm9maWxlLGRlZnMsZGVzYyxkaXNjYXJkLGVsbGlwc2UsZmVCbGVuZCxmZUNvbG9yTWF0cml4LGZlQ29tcG9uZW50VHJhbnNmZXIsZmVDb21wb3NpdGUsZmVDb252b2x2ZU1hdHJpeCxmZURpZmZ1c2VMaWdodGluZyxmZURpc3BsYWNlbWVudE1hcCxmZURpc3RhbnRMaWdodCxmZURyb3BTaGFkb3csZmVGbG9vZCxmZUZ1bmNBLGZlRnVuY0IsZmVGdW5jRyxmZUZ1bmNSLGZlR2F1c3NpYW5CbHVyLGZlSW1hZ2UsZmVNZXJnZSxmZU1lcmdlTm9kZSxmZU1vcnBob2xvZ3ksZmVPZmZzZXQsZmVQb2ludExpZ2h0LGZlU3BlY3VsYXJMaWdodGluZyxmZVNwb3RMaWdodCxmZVRpbGUsZmVUdXJidWxlbmNlLGZpbHRlcixmb3JlaWduT2JqZWN0LGcsaGF0Y2gsaGF0Y2hwYXRoLGltYWdlLGxpbmUsbGluZWFyR3JhZGllbnQsbWFya2VyLG1hc2ssbWVzaCxtZXNoZ3JhZGllbnQsbWVzaHBhdGNoLG1lc2hyb3csbWV0YWRhdGEsbXBhdGgscGF0aCxwYXR0ZXJuLHBvbHlnb24scG9seWxpbmUscmFkaWFsR3JhZGllbnQscmVjdCxzZXQsc29saWRjb2xvcixzdG9wLHN3aXRjaCxzeW1ib2wsdGV4dCx0ZXh0UGF0aCx0aXRsZSx0c3Bhbix1bmtub3duLHVzZSx2aWV3XCI7XG5jb25zdCBWT0lEX1RBR1MgPSBcImFyZWEsYmFzZSxicixjb2wsZW1iZWQsaHIsaW1nLGlucHV0LGxpbmssbWV0YSxwYXJhbSxzb3VyY2UsdHJhY2ssd2JyXCI7XG5jb25zdCBpc0hUTUxUYWcgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChIVE1MX1RBR1MpO1xuY29uc3QgaXNTVkdUYWcgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChTVkdfVEFHUyk7XG5jb25zdCBpc1ZvaWRUYWcgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChWT0lEX1RBR1MpO1xuXG5jb25zdCBzcGVjaWFsQm9vbGVhbkF0dHJzID0gYGl0ZW1zY29wZSxhbGxvd2Z1bGxzY3JlZW4sZm9ybW5vdmFsaWRhdGUsaXNtYXAsbm9tb2R1bGUsbm92YWxpZGF0ZSxyZWFkb25seWA7XG5jb25zdCBpc1NwZWNpYWxCb29sZWFuQXR0ciA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMpO1xuY29uc3QgaXNCb29sZWFuQXR0ciA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKFxuICBzcGVjaWFsQm9vbGVhbkF0dHJzICsgYCxhc3luYyxhdXRvZm9jdXMsYXV0b3BsYXksY29udHJvbHMsZGVmYXVsdCxkZWZlcixkaXNhYmxlZCxoaWRkZW4saW5lcnQsbG9vcCxvcGVuLHJlcXVpcmVkLHJldmVyc2VkLHNjb3BlZCxzZWFtbGVzcyxjaGVja2VkLG11dGVkLG11bHRpcGxlLHNlbGVjdGVkYFxuKTtcbmZ1bmN0aW9uIGluY2x1ZGVCb29sZWFuQXR0cih2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSB8fCB2YWx1ZSA9PT0gXCJcIjtcbn1cbmNvbnN0IHVuc2FmZUF0dHJDaGFyUkUgPSAvWz4vPVwiJ1xcdTAwMDlcXHUwMDBhXFx1MDAwY1xcdTAwMjBdLztcbmNvbnN0IGF0dHJWYWxpZGF0aW9uQ2FjaGUgPSB7fTtcbmZ1bmN0aW9uIGlzU1NSU2FmZUF0dHJOYW1lKG5hbWUpIHtcbiAgaWYgKGF0dHJWYWxpZGF0aW9uQ2FjaGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICByZXR1cm4gYXR0clZhbGlkYXRpb25DYWNoZVtuYW1lXTtcbiAgfVxuICBjb25zdCBpc1Vuc2FmZSA9IHVuc2FmZUF0dHJDaGFyUkUudGVzdChuYW1lKTtcbiAgaWYgKGlzVW5zYWZlKSB7XG4gICAgY29uc29sZS5lcnJvcihgdW5zYWZlIGF0dHJpYnV0ZSBuYW1lOiAke25hbWV9YCk7XG4gIH1cbiAgcmV0dXJuIGF0dHJWYWxpZGF0aW9uQ2FjaGVbbmFtZV0gPSAhaXNVbnNhZmU7XG59XG5jb25zdCBwcm9wc1RvQXR0ck1hcCA9IHtcbiAgYWNjZXB0Q2hhcnNldDogXCJhY2NlcHQtY2hhcnNldFwiLFxuICBjbGFzc05hbWU6IFwiY2xhc3NcIixcbiAgaHRtbEZvcjogXCJmb3JcIixcbiAgaHR0cEVxdWl2OiBcImh0dHAtZXF1aXZcIlxufTtcbmNvbnN0IGlzS25vd25IdG1sQXR0ciA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKFxuICBgYWNjZXB0LGFjY2VwdC1jaGFyc2V0LGFjY2Vzc2tleSxhY3Rpb24sYWxpZ24sYWxsb3csYWx0LGFzeW5jLGF1dG9jYXBpdGFsaXplLGF1dG9jb21wbGV0ZSxhdXRvZm9jdXMsYXV0b3BsYXksYmFja2dyb3VuZCxiZ2NvbG9yLGJvcmRlcixidWZmZXJlZCxjYXB0dXJlLGNoYWxsZW5nZSxjaGFyc2V0LGNoZWNrZWQsY2l0ZSxjbGFzcyxjb2RlLGNvZGViYXNlLGNvbG9yLGNvbHMsY29sc3Bhbixjb250ZW50LGNvbnRlbnRlZGl0YWJsZSxjb250ZXh0bWVudSxjb250cm9scyxjb29yZHMsY3Jvc3NvcmlnaW4sY3NwLGRhdGEsZGF0ZXRpbWUsZGVjb2RpbmcsZGVmYXVsdCxkZWZlcixkaXIsZGlybmFtZSxkaXNhYmxlZCxkb3dubG9hZCxkcmFnZ2FibGUsZHJvcHpvbmUsZW5jdHlwZSxlbnRlcmtleWhpbnQsZm9yLGZvcm0sZm9ybWFjdGlvbixmb3JtZW5jdHlwZSxmb3JtbWV0aG9kLGZvcm1ub3ZhbGlkYXRlLGZvcm10YXJnZXQsaGVhZGVycyxoZWlnaHQsaGlkZGVuLGhpZ2gsaHJlZixocmVmbGFuZyxodHRwLWVxdWl2LGljb24saWQsaW1wb3J0YW5jZSxpbmVydCxpbnRlZ3JpdHksaXNtYXAsaXRlbXByb3Asa2V5dHlwZSxraW5kLGxhYmVsLGxhbmcsbGFuZ3VhZ2UsbG9hZGluZyxsaXN0LGxvb3AsbG93LG1hbmlmZXN0LG1heCxtYXhsZW5ndGgsbWlubGVuZ3RoLG1lZGlhLG1pbixtdWx0aXBsZSxtdXRlZCxuYW1lLG5vdmFsaWRhdGUsb3BlbixvcHRpbXVtLHBhdHRlcm4scGluZyxwbGFjZWhvbGRlcixwb3N0ZXIscHJlbG9hZCxyYWRpb2dyb3VwLHJlYWRvbmx5LHJlZmVycmVycG9saWN5LHJlbCxyZXF1aXJlZCxyZXZlcnNlZCxyb3dzLHJvd3NwYW4sc2FuZGJveCxzY29wZSxzY29wZWQsc2VsZWN0ZWQsc2hhcGUsc2l6ZSxzaXplcyxzbG90LHNwYW4sc3BlbGxjaGVjayxzcmMsc3JjZG9jLHNyY2xhbmcsc3Jjc2V0LHN0YXJ0LHN0ZXAsc3R5bGUsc3VtbWFyeSx0YWJpbmRleCx0YXJnZXQsdGl0bGUsdHJhbnNsYXRlLHR5cGUsdXNlbWFwLHZhbHVlLHdpZHRoLHdyYXBgXG4pO1xuY29uc3QgaXNLbm93blN2Z0F0dHIgPSAvKiBAX19QVVJFX18gKi8gbWFrZU1hcChcbiAgYHhtbG5zLGFjY2VudC1oZWlnaHQsYWNjdW11bGF0ZSxhZGRpdGl2ZSxhbGlnbm1lbnQtYmFzZWxpbmUsYWxwaGFiZXRpYyxhbXBsaXR1ZGUsYXJhYmljLWZvcm0sYXNjZW50LGF0dHJpYnV0ZU5hbWUsYXR0cmlidXRlVHlwZSxhemltdXRoLGJhc2VGcmVxdWVuY3ksYmFzZWxpbmUtc2hpZnQsYmFzZVByb2ZpbGUsYmJveCxiZWdpbixiaWFzLGJ5LGNhbGNNb2RlLGNhcC1oZWlnaHQsY2xhc3MsY2xpcCxjbGlwUGF0aFVuaXRzLGNsaXAtcGF0aCxjbGlwLXJ1bGUsY29sb3IsY29sb3ItaW50ZXJwb2xhdGlvbixjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnMsY29sb3ItcHJvZmlsZSxjb2xvci1yZW5kZXJpbmcsY29udGVudFNjcmlwdFR5cGUsY29udGVudFN0eWxlVHlwZSxjcm9zc29yaWdpbixjdXJzb3IsY3gsY3ksZCxkZWNlbGVyYXRlLGRlc2NlbnQsZGlmZnVzZUNvbnN0YW50LGRpcmVjdGlvbixkaXNwbGF5LGRpdmlzb3IsZG9taW5hbnQtYmFzZWxpbmUsZHVyLGR4LGR5LGVkZ2VNb2RlLGVsZXZhdGlvbixlbmFibGUtYmFja2dyb3VuZCxlbmQsZXhwb25lbnQsZmlsbCxmaWxsLW9wYWNpdHksZmlsbC1ydWxlLGZpbHRlcixmaWx0ZXJSZXMsZmlsdGVyVW5pdHMsZmxvb2QtY29sb3IsZmxvb2Qtb3BhY2l0eSxmb250LWZhbWlseSxmb250LXNpemUsZm9udC1zaXplLWFkanVzdCxmb250LXN0cmV0Y2gsZm9udC1zdHlsZSxmb250LXZhcmlhbnQsZm9udC13ZWlnaHQsZm9ybWF0LGZyb20sZnIsZngsZnksZzEsZzIsZ2x5cGgtbmFtZSxnbHlwaC1vcmllbnRhdGlvbi1ob3Jpem9udGFsLGdseXBoLW9yaWVudGF0aW9uLXZlcnRpY2FsLGdseXBoUmVmLGdyYWRpZW50VHJhbnNmb3JtLGdyYWRpZW50VW5pdHMsaGFuZ2luZyxoZWlnaHQsaHJlZixocmVmbGFuZyxob3Jpei1hZHYteCxob3Jpei1vcmlnaW4teCxpZCxpZGVvZ3JhcGhpYyxpbWFnZS1yZW5kZXJpbmcsaW4saW4yLGludGVyY2VwdCxrLGsxLGsyLGszLGs0LGtlcm5lbE1hdHJpeCxrZXJuZWxVbml0TGVuZ3RoLGtlcm5pbmcsa2V5UG9pbnRzLGtleVNwbGluZXMsa2V5VGltZXMsbGFuZyxsZW5ndGhBZGp1c3QsbGV0dGVyLXNwYWNpbmcsbGlnaHRpbmctY29sb3IsbGltaXRpbmdDb25lQW5nbGUsbG9jYWwsbWFya2VyLWVuZCxtYXJrZXItbWlkLG1hcmtlci1zdGFydCxtYXJrZXJIZWlnaHQsbWFya2VyVW5pdHMsbWFya2VyV2lkdGgsbWFzayxtYXNrQ29udGVudFVuaXRzLG1hc2tVbml0cyxtYXRoZW1hdGljYWwsbWF4LG1lZGlhLG1ldGhvZCxtaW4sbW9kZSxuYW1lLG51bU9jdGF2ZXMsb2Zmc2V0LG9wYWNpdHksb3BlcmF0b3Isb3JkZXIsb3JpZW50LG9yaWVudGF0aW9uLG9yaWdpbixvdmVyZmxvdyxvdmVybGluZS1wb3NpdGlvbixvdmVybGluZS10aGlja25lc3MscGFub3NlLTEscGFpbnQtb3JkZXIscGF0aCxwYXRoTGVuZ3RoLHBhdHRlcm5Db250ZW50VW5pdHMscGF0dGVyblRyYW5zZm9ybSxwYXR0ZXJuVW5pdHMscGluZyxwb2ludGVyLWV2ZW50cyxwb2ludHMscG9pbnRzQXRYLHBvaW50c0F0WSxwb2ludHNBdFoscHJlc2VydmVBbHBoYSxwcmVzZXJ2ZUFzcGVjdFJhdGlvLHByaW1pdGl2ZVVuaXRzLHIscmFkaXVzLHJlZmVycmVyUG9saWN5LHJlZlgscmVmWSxyZWwscmVuZGVyaW5nLWludGVudCxyZXBlYXRDb3VudCxyZXBlYXREdXIscmVxdWlyZWRFeHRlbnNpb25zLHJlcXVpcmVkRmVhdHVyZXMscmVzdGFydCxyZXN1bHQscm90YXRlLHJ4LHJ5LHNjYWxlLHNlZWQsc2hhcGUtcmVuZGVyaW5nLHNsb3BlLHNwYWNpbmcsc3BlY3VsYXJDb25zdGFudCxzcGVjdWxhckV4cG9uZW50LHNwZWVkLHNwcmVhZE1ldGhvZCxzdGFydE9mZnNldCxzdGREZXZpYXRpb24sc3RlbWgsc3RlbXYsc3RpdGNoVGlsZXMsc3RvcC1jb2xvcixzdG9wLW9wYWNpdHksc3RyaWtldGhyb3VnaC1wb3NpdGlvbixzdHJpa2V0aHJvdWdoLXRoaWNrbmVzcyxzdHJpbmcsc3Ryb2tlLHN0cm9rZS1kYXNoYXJyYXksc3Ryb2tlLWRhc2hvZmZzZXQsc3Ryb2tlLWxpbmVjYXAsc3Ryb2tlLWxpbmVqb2luLHN0cm9rZS1taXRlcmxpbWl0LHN0cm9rZS1vcGFjaXR5LHN0cm9rZS13aWR0aCxzdHlsZSxzdXJmYWNlU2NhbGUsc3lzdGVtTGFuZ3VhZ2UsdGFiaW5kZXgsdGFibGVWYWx1ZXMsdGFyZ2V0LHRhcmdldFgsdGFyZ2V0WSx0ZXh0LWFuY2hvcix0ZXh0LWRlY29yYXRpb24sdGV4dC1yZW5kZXJpbmcsdGV4dExlbmd0aCx0byx0cmFuc2Zvcm0sdHJhbnNmb3JtLW9yaWdpbix0eXBlLHUxLHUyLHVuZGVybGluZS1wb3NpdGlvbix1bmRlcmxpbmUtdGhpY2tuZXNzLHVuaWNvZGUsdW5pY29kZS1iaWRpLHVuaWNvZGUtcmFuZ2UsdW5pdHMtcGVyLWVtLHYtYWxwaGFiZXRpYyx2LWhhbmdpbmcsdi1pZGVvZ3JhcGhpYyx2LW1hdGhlbWF0aWNhbCx2YWx1ZXMsdmVjdG9yLWVmZmVjdCx2ZXJzaW9uLHZlcnQtYWR2LXksdmVydC1vcmlnaW4teCx2ZXJ0LW9yaWdpbi15LHZpZXdCb3gsdmlld1RhcmdldCx2aXNpYmlsaXR5LHdpZHRoLHdpZHRocyx3b3JkLXNwYWNpbmcsd3JpdGluZy1tb2RlLHgseC1oZWlnaHQseDEseDIseENoYW5uZWxTZWxlY3Rvcix4bGluazphY3R1YXRlLHhsaW5rOmFyY3JvbGUseGxpbms6aHJlZix4bGluazpyb2xlLHhsaW5rOnNob3cseGxpbms6dGl0bGUseGxpbms6dHlwZSx4bWw6YmFzZSx4bWw6bGFuZyx4bWw6c3BhY2UseSx5MSx5Mix5Q2hhbm5lbFNlbGVjdG9yLHosem9vbUFuZFBhbmBcbik7XG5cbmNvbnN0IGVzY2FwZVJFID0gL1tcIicmPD5dLztcbmZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyaW5nKSB7XG4gIGNvbnN0IHN0ciA9IFwiXCIgKyBzdHJpbmc7XG4gIGNvbnN0IG1hdGNoID0gZXNjYXBlUkUuZXhlYyhzdHIpO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBsZXQgaHRtbCA9IFwiXCI7XG4gIGxldCBlc2NhcGVkO1xuICBsZXQgaW5kZXg7XG4gIGxldCBsYXN0SW5kZXggPSAwO1xuICBmb3IgKGluZGV4ID0gbWF0Y2guaW5kZXg7IGluZGV4IDwgc3RyLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIHN3aXRjaCAoc3RyLmNoYXJDb2RlQXQoaW5kZXgpKSB7XG4gICAgICBjYXNlIDM0OlxuICAgICAgICBlc2NhcGVkID0gXCImcXVvdDtcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM4OlxuICAgICAgICBlc2NhcGVkID0gXCImYW1wO1wiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzk6XG4gICAgICAgIGVzY2FwZWQgPSBcIiYjMzk7XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA2MDpcbiAgICAgICAgZXNjYXBlZCA9IFwiJmx0O1wiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNjI6XG4gICAgICAgIGVzY2FwZWQgPSBcIiZndDtcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGxhc3RJbmRleCAhPT0gaW5kZXgpIHtcbiAgICAgIGh0bWwgKz0gc3RyLnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpO1xuICAgIH1cbiAgICBsYXN0SW5kZXggPSBpbmRleCArIDE7XG4gICAgaHRtbCArPSBlc2NhcGVkO1xuICB9XG4gIHJldHVybiBsYXN0SW5kZXggIT09IGluZGV4ID8gaHRtbCArIHN0ci5zbGljZShsYXN0SW5kZXgsIGluZGV4KSA6IGh0bWw7XG59XG5jb25zdCBjb21tZW50U3RyaXBSRSA9IC9eLT8+fDwhLS18LS0+fC0tIT58PCEtJC9nO1xuZnVuY3Rpb24gZXNjYXBlSHRtbENvbW1lbnQoc3JjKSB7XG4gIHJldHVybiBzcmMucmVwbGFjZShjb21tZW50U3RyaXBSRSwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIGxvb3NlQ29tcGFyZUFycmF5cyhhLCBiKSB7XG4gIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBsZXQgZXF1YWwgPSB0cnVlO1xuICBmb3IgKGxldCBpID0gMDsgZXF1YWwgJiYgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICBlcXVhbCA9IGxvb3NlRXF1YWwoYVtpXSwgYltpXSk7XG4gIH1cbiAgcmV0dXJuIGVxdWFsO1xufVxuZnVuY3Rpb24gbG9vc2VFcXVhbChhLCBiKSB7XG4gIGlmIChhID09PSBiKVxuICAgIHJldHVybiB0cnVlO1xuICBsZXQgYVZhbGlkVHlwZSA9IGlzRGF0ZShhKTtcbiAgbGV0IGJWYWxpZFR5cGUgPSBpc0RhdGUoYik7XG4gIGlmIChhVmFsaWRUeXBlIHx8IGJWYWxpZFR5cGUpIHtcbiAgICByZXR1cm4gYVZhbGlkVHlwZSAmJiBiVmFsaWRUeXBlID8gYS5nZXRUaW1lKCkgPT09IGIuZ2V0VGltZSgpIDogZmFsc2U7XG4gIH1cbiAgYVZhbGlkVHlwZSA9IGlzU3ltYm9sKGEpO1xuICBiVmFsaWRUeXBlID0gaXNTeW1ib2woYik7XG4gIGlmIChhVmFsaWRUeXBlIHx8IGJWYWxpZFR5cGUpIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgfVxuICBhVmFsaWRUeXBlID0gaXNBcnJheShhKTtcbiAgYlZhbGlkVHlwZSA9IGlzQXJyYXkoYik7XG4gIGlmIChhVmFsaWRUeXBlIHx8IGJWYWxpZFR5cGUpIHtcbiAgICByZXR1cm4gYVZhbGlkVHlwZSAmJiBiVmFsaWRUeXBlID8gbG9vc2VDb21wYXJlQXJyYXlzKGEsIGIpIDogZmFsc2U7XG4gIH1cbiAgYVZhbGlkVHlwZSA9IGlzT2JqZWN0KGEpO1xuICBiVmFsaWRUeXBlID0gaXNPYmplY3QoYik7XG4gIGlmIChhVmFsaWRUeXBlIHx8IGJWYWxpZFR5cGUpIHtcbiAgICBpZiAoIWFWYWxpZFR5cGUgfHwgIWJWYWxpZFR5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgYUtleXNDb3VudCA9IE9iamVjdC5rZXlzKGEpLmxlbmd0aDtcbiAgICBjb25zdCBiS2V5c0NvdW50ID0gT2JqZWN0LmtleXMoYikubGVuZ3RoO1xuICAgIGlmIChhS2V5c0NvdW50ICE9PSBiS2V5c0NvdW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIGEpIHtcbiAgICAgIGNvbnN0IGFIYXNLZXkgPSBhLmhhc093blByb3BlcnR5KGtleSk7XG4gICAgICBjb25zdCBiSGFzS2V5ID0gYi5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgaWYgKGFIYXNLZXkgJiYgIWJIYXNLZXkgfHwgIWFIYXNLZXkgJiYgYkhhc0tleSB8fCAhbG9vc2VFcXVhbChhW2tleV0sIGJba2V5XSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gU3RyaW5nKGEpID09PSBTdHJpbmcoYik7XG59XG5mdW5jdGlvbiBsb29zZUluZGV4T2YoYXJyLCB2YWwpIHtcbiAgcmV0dXJuIGFyci5maW5kSW5kZXgoKGl0ZW0pID0+IGxvb3NlRXF1YWwoaXRlbSwgdmFsKSk7XG59XG5cbmNvbnN0IHRvRGlzcGxheVN0cmluZyA9ICh2YWwpID0+IHtcbiAgcmV0dXJuIGlzU3RyaW5nKHZhbCkgPyB2YWwgOiB2YWwgPT0gbnVsbCA/IFwiXCIgOiBpc0FycmF5KHZhbCkgfHwgaXNPYmplY3QodmFsKSAmJiAodmFsLnRvU3RyaW5nID09PSBvYmplY3RUb1N0cmluZyB8fCAhaXNGdW5jdGlvbih2YWwudG9TdHJpbmcpKSA/IEpTT04uc3RyaW5naWZ5KHZhbCwgcmVwbGFjZXIsIDIpIDogU3RyaW5nKHZhbCk7XG59O1xuY29uc3QgcmVwbGFjZXIgPSAoX2tleSwgdmFsKSA9PiB7XG4gIGlmICh2YWwgJiYgdmFsLl9fdl9pc1JlZikge1xuICAgIHJldHVybiByZXBsYWNlcihfa2V5LCB2YWwudmFsdWUpO1xuICB9IGVsc2UgaWYgKGlzTWFwKHZhbCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW2BNYXAoJHt2YWwuc2l6ZX0pYF06IFsuLi52YWwuZW50cmllcygpXS5yZWR1Y2UoKGVudHJpZXMsIFtrZXksIHZhbDJdKSA9PiB7XG4gICAgICAgIGVudHJpZXNbYCR7a2V5fSA9PmBdID0gdmFsMjtcbiAgICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgICB9LCB7fSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKGlzU2V0KHZhbCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW2BTZXQoJHt2YWwuc2l6ZX0pYF06IFsuLi52YWwudmFsdWVzKCldXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpICYmICFpc0FycmF5KHZhbCkgJiYgIWlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgIHJldHVybiBTdHJpbmcodmFsKTtcbiAgfVxuICByZXR1cm4gdmFsO1xufTtcblxuZXhwb3J0IHsgRU1QVFlfQVJSLCBFTVBUWV9PQkosIE5PLCBOT09QLCBQYXRjaEZsYWdOYW1lcywgY2FtZWxpemUsIGNhcGl0YWxpemUsIGRlZiwgZXNjYXBlSHRtbCwgZXNjYXBlSHRtbENvbW1lbnQsIGV4dGVuZCwgZ2VuUHJvcHNBY2Nlc3NFeHAsIGdlbmVyYXRlQ29kZUZyYW1lLCBnZXRHbG9iYWxUaGlzLCBoYXNDaGFuZ2VkLCBoYXNPd24sIGh5cGhlbmF0ZSwgaW5jbHVkZUJvb2xlYW5BdHRyLCBpbnZva2VBcnJheUZucywgaXNBcnJheSwgaXNCb29sZWFuQXR0ciwgaXNCdWlsdEluRGlyZWN0aXZlLCBpc0RhdGUsIGlzRnVuY3Rpb24sIGlzR2xvYmFsbHlXaGl0ZWxpc3RlZCwgaXNIVE1MVGFnLCBpc0ludGVnZXJLZXksIGlzS25vd25IdG1sQXR0ciwgaXNLbm93blN2Z0F0dHIsIGlzTWFwLCBpc01vZGVsTGlzdGVuZXIsIGlzT2JqZWN0LCBpc09uLCBpc1BsYWluT2JqZWN0LCBpc1Byb21pc2UsIGlzUmVnRXhwLCBpc1Jlc2VydmVkUHJvcCwgaXNTU1JTYWZlQXR0ck5hbWUsIGlzU1ZHVGFnLCBpc1NldCwgaXNTcGVjaWFsQm9vbGVhbkF0dHIsIGlzU3RyaW5nLCBpc1N5bWJvbCwgaXNWb2lkVGFnLCBsb29zZUVxdWFsLCBsb29zZUluZGV4T2YsIGxvb3NlVG9OdW1iZXIsIG1ha2VNYXAsIG5vcm1hbGl6ZUNsYXNzLCBub3JtYWxpemVQcm9wcywgbm9ybWFsaXplU3R5bGUsIG9iamVjdFRvU3RyaW5nLCBwYXJzZVN0cmluZ1N0eWxlLCBwcm9wc1RvQXR0ck1hcCwgcmVtb3ZlLCBzbG90RmxhZ3NUZXh0LCBzdHJpbmdpZnlTdHlsZSwgdG9EaXNwbGF5U3RyaW5nLCB0b0hhbmRsZXJLZXksIHRvTnVtYmVyLCB0b1Jhd1R5cGUsIHRvVHlwZVN0cmluZyB9O1xuIiwiPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIDxoMT5BbGwgUGxheWVyczwvaDE+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIFxuICB9XG48L3NjcmlwdD4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIHJ1bnRpbWUgaGVscGVyIGZvciBzZXR0aW5nIHByb3BlcnRpZXMgb24gY29tcG9uZW50c1xuLy8gaW4gYSB0cmVlLXNoYWthYmxlIHdheVxuZXhwb3J0cy5kZWZhdWx0ID0gKHNmYywgcHJvcHMpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBzZmMuX192Y2NPcHRzIHx8IHNmYztcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgcHJvcHMpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWw7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuIiwiaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vVGFibGUudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTM0YzEwNjIwXCJcbmltcG9ydCBzY3JpcHQgZnJvbSBcIi4vVGFibGUudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCJcbmV4cG9ydCAqIGZyb20gXCIuL1RhYmxlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiXG5cbmltcG9ydCBleHBvcnRDb21wb25lbnQgZnJvbSBcIi4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvZXhwb3J0SGVscGVyLmpzXCJcbmNvbnN0IF9fZXhwb3J0c19fID0gLyojX19QVVJFX18qL2V4cG9ydENvbXBvbmVudChzY3JpcHQsIFtbJ3JlbmRlcicscmVuZGVyXSxbJ19fZmlsZScsXCJzcmMvdnVlL3BhZ2VzL2FkbWluL3RlYW0tcGxheWVycy9hbGwvVGFibGUudnVlXCJdXSlcbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7XG4gIF9fZXhwb3J0c19fLl9faG1ySWQgPSBcIjM0YzEwNjIwXCJcbiAgY29uc3QgYXBpID0gX19WVUVfSE1SX1JVTlRJTUVfX1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghYXBpLmNyZWF0ZVJlY29yZCgnMzRjMTA2MjAnLCBfX2V4cG9ydHNfXykpIHtcbiAgICBhcGkucmVsb2FkKCczNGMxMDYyMCcsIF9fZXhwb3J0c19fKVxuICB9XG4gIFxuICBtb2R1bGUuaG90LmFjY2VwdChcIi4vVGFibGUudnVlP3Z1ZSZ0eXBlPXRlbXBsYXRlJmlkPTM0YzEwNjIwXCIsICgpID0+IHtcbiAgICBhcGkucmVyZW5kZXIoJzM0YzEwNjIwJywgcmVuZGVyKVxuICB9KVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgX19leHBvcnRzX18iLCJleHBvcnQgeyBkZWZhdWx0IH0gZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanM/P2Nsb25lZFJ1bGVTZXQtMi51c2UhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC9pbmRleC5qcz8/cnVsZVNldFsxXS5ydWxlc1sxMF0udXNlWzBdIS4vVGFibGUudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzXCI7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1sb2FkZXIvbGliL2luZGV4LmpzPz9jbG9uZWRSdWxlU2V0LTIudXNlIS4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2Rpc3QvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbMTBdLnVzZVswXSEuL1RhYmxlLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiIiwiZXhwb3J0ICogZnJvbSBcIi0hLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLWxvYWRlci9saWIvaW5kZXguanM/P2Nsb25lZFJ1bGVTZXQtMi51c2UhLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvZGlzdC90ZW1wbGF0ZUxvYWRlci5qcz8/cnVsZVNldFsxXS5ydWxlc1syXSEuLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9kaXN0L2luZGV4LmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzEwXS51c2VbMF0hLi9UYWJsZS52dWU/dnVlJnR5cGU9dGVtcGxhdGUmaWQ9MzRjMTA2MjBcIiIsImltcG9ydCB7IGluaXRDdXN0b21Gb3JtYXR0ZXIsIHdhcm4gfSBmcm9tICdAdnVlL3J1bnRpbWUtZG9tJztcbmV4cG9ydCAqIGZyb20gJ0B2dWUvcnVudGltZS1kb20nO1xuXG5mdW5jdGlvbiBpbml0RGV2KCkge1xuICB7XG4gICAgaW5pdEN1c3RvbUZvcm1hdHRlcigpO1xuICB9XG59XG5cbmlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gIGluaXREZXYoKTtcbn1cbmNvbnN0IGNvbXBpbGUgPSAoKSA9PiB7XG4gIGlmICghIShwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpKSB7XG4gICAgd2FybihcbiAgICAgIGBSdW50aW1lIGNvbXBpbGF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBidWlsZCBvZiBWdWUuYCArIChgIENvbmZpZ3VyZSB5b3VyIGJ1bmRsZXIgdG8gYWxpYXMgXCJ2dWVcIiB0byBcInZ1ZS9kaXN0L3Z1ZS5lc20tYnVuZGxlci5qc1wiLmAgKVxuICAgICAgLyogc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICApO1xuICB9XG59O1xuXG5leHBvcnQgeyBjb21waWxlIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSBcInZ1ZVwiO1xuaW1wb3J0IFRhYmxlIGZyb20gJy4vVGFibGUudnVlJ1xuXG5jb25zdCBhcHAgPSBjcmVhdGVBcHAoVGFibGUpXG5hcHAubW91bnQoJyNyb290JykiXSwibmFtZXMiOlsiX2NyZWF0ZUVsZW1lbnRWTm9kZSIsIl9ob2lzdGVkXzEiLCJfY3JlYXRlRWxlbWVudEJsb2NrIiwiX2hvaXN0ZWRfMiIsImNyZWF0ZUFwcCIsIlRhYmxlIiwiYXBwIiwibW91bnQiXSwic291cmNlUm9vdCI6IiJ9