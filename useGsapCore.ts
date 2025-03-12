'use client'

import { useLayoutEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FetchingSide } from '@business-logic/fetching/type'
import { LoggerContext } from '@business-logic/helper/logger/type'
import { Logger } from '@business-logic/helper/logger'

const logger = new Logger(FetchingSide.Client, LoggerContext.Gsap)

const registeredPlugins = new Set<string>()
const GSAP_PLUGINS = [{ plugin: ScrollTrigger, key: 'ScrollTrigger' }]

type TMatchMediaConditionsType = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2Xl: boolean
  reduceMotion: boolean
} | null
type TCallbackProps = (props: {
  gsap: typeof gsap
  ScrollTrigger: typeof ScrollTrigger
  matchMediaConditions: TMatchMediaConditionsType
}) => any

export const useGsap = (
  callback: TCallbackProps,
  options?: {
    dependencies?: any[]
    matchMedia?: boolean
  },
) => {
  useLayoutEffect(() => {
    let callbackCleanUpFunction: (() => void) | undefined
    let matchMediaConditions: TMatchMediaConditionsType = null

    // Register GSAP plugins
    GSAP_PLUGINS.forEach(({ plugin, key }) => {
      if (!registeredPlugins.has(key)) {
        logger.info(`${key} plugin has registered`)
        gsap.registerPlugin(plugin)
        registeredPlugins.add(key)
      }
    })

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      immediateRender: false,
      invalidateOnRefresh: true,
    })
    ScrollTrigger.config({
      ignoreMobileResize: true,
    })

    // Initialize gsap.matchMedia if enabled
    let matchMedia: gsap.MatchMedia | null = null
    if (options?.matchMedia) {
      matchMedia = gsap.matchMedia()
      matchMedia.add(
        {
          isXs: '(max-width: 400px)',
          isSm: '(max-width: 640px)',
          isMd: '(max-width: 768px)',
          isLg: '(max-width: 1024px)',
          isXl: '(max-width: 1280px)',
          is2Xl: '(max-width: 1536px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          matchMediaConditions = context.conditions as TMatchMediaConditionsType
        },
      )
    }

    // Invoke callback and capture cleanup
    callbackCleanUpFunction = callback({
      gsap,
      ScrollTrigger,
      matchMediaConditions,
    })

    // Cleanup
    return () => {
      if (matchMedia) {
        logger.info('Killing gsap.matchMedia')
        matchMedia.kill()
      }
      callbackCleanUpFunction && callbackCleanUpFunction()
    }
  }, options?.dependencies ?? [])
}
