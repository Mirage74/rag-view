import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  switchSearchMode,
  setTopK,
  setTopP,
} from "../../../features/slices/rag-slice";
import {
  TOP_K_MIN_VALUE,
  TOP_K_DEFAULT_VALUE,
  TOP_K_MAX_VALUE,
  TOP_P_FAST_VALUE,
  TOP_P_DEFAULT_VALUE,
  TOP_P_SLOW_VALUE,
} from "../../../features/constants";

const SettingsPanel = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { isUseOnlyContextSearch, topK, topP } = useSelector(
    (state) => state.ragConfig,
  );

  return (
    <div className="p-3 pb-4 border-t border-slate-700/50 shrink-0 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm font-medium">Settings</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-slate-800/80 rounded-lg border border-slate-700/50 p-3 space-y-3">
          {/* Search Mode */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Search Mode
            </h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="searchMode"
                  checked={isUseOnlyContextSearch}
                  onChange={() => dispatch(switchSearchMode())}
                  className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                />
                <span className="text-slate-300">Only context</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="searchMode"
                  checked={!isUseOnlyContextSearch}
                  onChange={() => dispatch(switchSearchMode())}
                  className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                />
                <span className="text-slate-300">Allow external</span>
              </label>
            </div>
          </div>

          {/* Top K */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Top K
            </h4>
            <div className="space-y-1.5">
              {[
                { value: TOP_K_MIN_VALUE, label: "Precise" },
                { value: TOP_K_DEFAULT_VALUE, label: "Default" },
                { value: TOP_K_MAX_VALUE, label: "Extended" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="radio"
                    name="topK"
                    checked={topK === value}
                    onChange={() => dispatch(setTopK(value))}
                    className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                  />
                  <span className="text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Top P */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Top P
            </h4>
            <div className="space-y-1.5">
              {[
                { value: TOP_P_FAST_VALUE, label: "Fast" },
                { value: TOP_P_DEFAULT_VALUE, label: "Default" },
                { value: TOP_P_SLOW_VALUE, label: "Large scan" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="radio"
                    name="topP"
                    checked={topP === value}
                    onChange={() => dispatch(setTopP(value))}
                    className="w-3 h-3 text-indigo-500 bg-slate-700 border-slate-600"
                  />
                  <span className="text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
