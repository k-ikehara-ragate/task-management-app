import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppStatCard from '~/components/AppStatCard.vue'

describe('AppStatCard', () => {
  it('ラベルと値を表示する', async () => {
    const wrapper = await mountSuspended(AppStatCard, {
      props: {
        label: '完了',
        value: 3,
      },
    })
    expect(wrapper.text()).toContain('完了')
    expect(wrapper.text()).toContain('3')
  })

  it('value が文字列でも表示する', async () => {
    const wrapper = await mountSuspended(AppStatCard, {
      props: {
        label: '未対応',
        value: '…',
      },
    })
    expect(wrapper.text()).toContain('未対応')
    expect(wrapper.text()).toContain('…')
  })
})
