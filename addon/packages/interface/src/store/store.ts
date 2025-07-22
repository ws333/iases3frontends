import { createStore, createTypedHooks } from "easy-peasy";
import type { Model } from "../types/modelTypes";
import { model } from "./model";

export const store = createStore<Model>(model, { disableImmer: true });

const typedHooks = createTypedHooks<Model>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
