'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const observerCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      !entry.target.classList.contains('anim-active') &&
        entry.target.classList.add('anim-active')
    }
  })
}
const OBSERVER_OPTIONS = { threshold: 0.2 }

type TProps = {
  animationComponentClasses?: string[]
}
export const WhileInViewAnimationTrigger = ({
  animationComponentClasses = [],
}: TProps) => {
  const pathName = usePathname()

  useEffect(() => {
    if (typeof document === 'undefined') return

    const observer = new IntersectionObserver(
      observerCallback,
      OBSERVER_OPTIONS,
    )

    const mutationObserver = new MutationObserver(() => {
      const elements = document.querySelectorAll(
        `${animationComponentClasses.join(', ')}, .pt-anim-while-in-view`,
      )
      if (elements.length > 0) {
        elements.forEach((el) => observer.observe(el))
        mutationObserver.disconnect()
      }
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathName])

  return null
}
