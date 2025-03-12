'use client'
import { IStrapiMedia } from '@business-logic/entities/cms/image'
import { useGsap } from '@business-logic/hooks/core/useGsapCore'
import { Icon } from '@presentational/components/common/icon/Icon'
import { IconName } from '@presentational/components/common/icon/type'
import { getStrapiImageUrl } from '@utils/helper/strapi-helper'
import Image from 'next/image'

type TProps = {
  className?: string
  video: IStrapiMedia
  hideScrollDownIcon: boolean
}
export const VideoSource = ({
  className = '',
  video,
  hideScrollDownIcon,
}: TProps) => {
  const isVideo = video && /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(video.url)
  useGsap(({ gsap }) => {
    const startPoint = 'top-=85px top'
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.pt-video-banner',
        start: startPoint,
        scrub: true,
      },
    })
    if (!hideScrollDownIcon) {
      timeline.fromTo(
        '.pt-scroll-down-icon',
        { rotate: '0deg' },
        { rotate: `520deg`, ease: 'power1.inOut' },
      )
    }

    gsap.to('.pt-video-banner__content', {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.pt-video-banner',
        start: startPoint,
        scrub: true,
      },
    })
    gsap.to('.pt-video-banner__video-wrapper', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        start: startPoint,
        trigger: '.pt-video-banner',
        scrub: true,
      },
    })
    return () => {
      timeline.kill()
    }
  })

  return (
    <div
      className={`${className} pt-video-banner__video-source tw-overflow-hidden tw-absolute tw-top-0 tw-left-0 tw-w-full tw-z-0 tw-h-full`}
    >
      <div className='pt-video-banner__video-wrapper tw-bg-black tw-w-full tw-h-full'>
        {isVideo ? (
          <video
            width='1920'
            height='1080'
            autoPlay
            loop
            muted
            playsInline
            preload='auto'
            className='pt-anim pt-anim__fade-in tw-anim-duration-normal tw-w-full tw-h-full tw-scale-110 tw-object-cover tw-pointer-events-none tw-cursor-default'
          >
            <source
              src={getStrapiImageUrl(video?.url)}
              type={video?.mime ?? 'video/mp4'}
            />
          </video>
        ) : (
          <Image
            src={video.url}
            alt='banner'
            fill
            className='pt-anim pt-anim__fade-in tw-anim-duration-normal tw-w-full tw-h-full tw-scale-110 tw-object-cover tw-pointer-events-none'
          />
        )}
      </div>
      {hideScrollDownIcon ? null : (
        <div className='tw-absolute tw-bottom-[15px] tw-right-[15px] md:tw-bottom-[30px] md:tw-right-[30px] tw-text-white'>
          <div className='tw-relative tw-grid tw-place-items-center tw-w-[144px] tw-h-[143px]'>
            <Icon
              iconName={IconName.ScrollDownCircle}
              width={144}
              height={143}
              className='tw-absolute tw-top-0 tw-left-0 tw-transition-transform pt-scroll-down-icon'
            />
            <Icon iconName={IconName.LongArrowDown} width={16} height={38} />
          </div>
        </div>
      )}
    </div>
  )
}
