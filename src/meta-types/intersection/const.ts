import { Get, IsObject } from "../../utils";

import { Resolve, MetaType, Never, Error } from "..";
import { Const, Value } from "../const";
import { Values, Required, IsOpen, OpenProps } from "../object";

import { Intersect } from "./index";

export type IntersectConst<A, B> = {
  any: A;
  never: Never;
  const: CheckExtendsResolved<A, B>;
  enum: CheckExtendsResolved<A, B>;
  primitive: CheckExtendsResolved<A, B>;
  array: CheckExtendsResolved<A, B>;
  tuple: CheckExtendsResolved<A, B>;
  object: ToObject<A, B>;
  union: Intersect<B, A>;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
  errorTypeProperty: Error<"Missing type property">;
}[Get<B, "type"> extends MetaType ? Get<B, "type"> : "errorTypeProperty"];

type CheckExtendsResolved<A, B> = Value<A> extends Resolve<B> ? A : Never;

type ToObject<A, B> = IsObject<Value<A>> extends true
  ? IntersectConstToObject<A, B>
  : Never;

type IntersectConstToObject<
  A,
  B,
  V = IntersectConstValues<Value<A>, B>
> = NeverKeys<V> extends never ? A : Never;

type IntersectConstValues<V, B> = {
  [key in keyof V | Required<B>]: key extends keyof V
    ? key extends keyof Values<B>
      ? Intersect<Const<V[key]>, Values<B>[key]>
      : IsOpen<B> extends true
      ? Intersect<Const<V[key]>, OpenProps<B>>
      : Never
    : Never;
};

type NeverKeys<O> = {
  [key in keyof O]: O[key] extends Never ? key : never;
}[keyof O];