import type { Ref, UnwrapRef } from 'vue'

/**
 * 为 useDialog props 绑定 v-model
 *
 * 将 ref 转换为 props 对象，包含值和更新事件。
 * 适用于 useDialog 中无法使用 v-model 语法的场景。
 *
 * @example
 * ```ts
 * const nickname = ref('张三')
 *
 * useDialog(FormDialog, {
 *   props: {
 *     ...vModel(nickname),
 *     // 等价于:
 *     // modelValue: nickname.value,
 *     // 'onUpdate:modelValue': (val) => nickname.value = val
 *   }
 * })
 *
 * // 命名 model
 * const age = ref(18)
 * useDialog(UserForm, {
 *   props: {
 *     ...vModel(age, 'age'),
 *     // 等价于:
 *     // age: 18,
 *     // 'onUpdate:age': (val) => age.value = val
 *   }
 * })
 * ```
 */
export function vModel<T>(
  ref: Ref<T>,
  name = 'modelValue',
): { [K in typeof name]: UnwrapRef<T> } & { [K in `onUpdate:${typeof name}`]: (val: T) => void } {
  return {
    [name]: ref.value,
    [`onUpdate:${name}`]: (val: T) => {
      ref.value = val
    },
  } as any
}

/**
 * 批量绑定多个 v-model
 *
 * @example
 * ```ts
 * const firstName = ref('张')
 * const lastName = ref('三')
 * const age = ref(18)
 *
 * useDialog(UserForm, {
 *   props: {
 *     ...vModels({ firstName, lastName, age }),
 *     // 等价于:
 *     // firstName: '张', 'onUpdate:firstName': (v) => firstName.value = v,
 *     // lastName: '三', 'onUpdate:lastName': (v) => lastName.value = v,
 *     // age: 18, 'onUpdate:age': (v) => age.value = v,
 *   }
 * })
 * ```
 */
export function vModels<T extends Record<string, Ref<unknown>>>(
  refs: T,
): { [K in keyof T]: UnwrapRef<T[K]> } & { [K in keyof T as `onUpdate:${K & string}`]: (val: UnwrapRef<T[K]>) => void } {
  const result: Record<string, unknown> = {}

  for (const [key, ref] of Object.entries(refs)) {
    result[key] = ref.value
    result[`onUpdate:${key}`] = (val: unknown) => {
      ref.value = val
    }
  }

  return result as any
}
