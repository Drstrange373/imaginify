"use client"

import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import { useToast } from '../ui/use-toast'

export default function TransformedImage({ image, type, title, transformationConfig, isTransforming, setIsTransforming, hasDownload = true }: TransformedImageProps) {
  // console.log({ image, type, title, transformationConfig, isTransforming, setIsTransforming, hasDownload  })
  const {toast} = useToast()

  function downloadHandler(event: React.MouseEvent) {
    event.preventDefault()
    download(getCldImageUrl({
      width:image.width,
      height:image.height,
      src: image.publicId,
      ...transformationConfig
    }), title)
  }

  async function handelImageLoadingError(event:any){
   
    setIsTransforming && setIsTransforming(false)
    const errorResponse = await fetch((event.target as any).src)
    const errorMessage = errorResponse.headers.get('x-cld-error')
    if(!errorMessage) return
    toast({
      className:'error-toast',
      title:'Error occurred while loading image',
      description:errorMessage,
      duration: 5000,
    })
  }

  
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>
        {
          (hasDownload && (
            <button className='download-btn' onClick={downloadHandler}>
              <Image
                src={'/assets/icons/download.svg'}
                alt='download'
                height={24}
                width={24}
                className='pb-[6px]'
              />
            </button>
          ))
        }
      </div>

      {
        image?.publicId && transformationConfig ? (
          <div className="relative">
            <CldImage
              width={getImageSize(type, image, "width")}
              height={getImageSize(type, image, "height")}
              src={image?.publicId}
              alt={image.title}
              sizes={"(max-width:767px) 100vh, 50vh"}
              placeholder={dataUrl as PlaceholderValue}
              className='transformed-image'
              onLoad={()=>{
                setIsTransforming && setIsTransforming(false)
              }}
              onError={handelImageLoadingError}
              {...transformationConfig}
            />

            {
              (isTransforming) && (
                <div className='transforming-loader'>
                  <Image src="/assets/icons/spinner.svg" 
                  width={50} 
                  height={50}
                  alt='transforming'
                  />
                </div>
              )
            }
            
          </div>
        ) : (
          <div className='transformed-placeholder'>
            Transformed Image
          </div>
        )
      }
    </div>
  )
}
