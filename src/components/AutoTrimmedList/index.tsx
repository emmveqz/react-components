//

import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import type IProps from './AutoTrimmedList.types'
import ItemsBadge from '../ItemsBadge'

//

const Tooltip = styled.div`
  & .tooltip-badge {
    max-width: 26px;
  }

  & .tooltip-content {
    background-color: #666;
    border-radius: 24px;
    color: #f0f0f0;
    display: none;
    padding: 8px 16px;
    position: absolute;
    text-align: center;
    z-index: 1;
  }

  &:hover .tooltip-content {
    display: block;
  }
`

function getCssStyle(el: HTMLElement, prop: string): string {
  return globalThis.getComputedStyle(el, null).getPropertyValue(prop)
}

function getCanvasFont(el: HTMLElement): string {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
  const fontSize = getCssStyle(el, 'font-size') || '16px'
  const fontFamily = getCssStyle(el, 'font-family') || 'Arial'

  return `${fontWeight} ${fontSize} ${fontFamily}`
}

const AutoTrimmedList: FC<IProps> = ({
  items,
  ...props
}) => {
  const trailingDots = ', ...'
  const containerRef = useRef<HTMLDivElement>(null)
  const [truncateIdx, setTruncateIdx] = useState(-1)

  const calculateTruncateIdx = useCallback(() => {
    const canvas = globalThis.document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.font = getCanvasFont(containerRef.current as HTMLElement)

    const trailingDotsWidth = Math.ceil(context.measureText(trailingDots).width)
    const containerWidth = containerRef.current?.offsetWidth || 0

    // 36 = Badge width.
    const availableWidth = containerWidth - trailingDotsWidth - 36

    let itemsTotalWidth = 0

    const idx = items.findIndex((item) => {
      itemsTotalWidth += Math.ceil(context.measureText(item).width)

      return itemsTotalWidth > availableWidth
    })

    setTruncateIdx(idx)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
  ])

  useLayoutEffect(() => {
    calculateTruncateIdx()

    const handleResize = () => {
      calculateTruncateIdx()
    }

    globalThis.addEventListener('resize', handleResize)

    return () => {
      globalThis.removeEventListener('resize', handleResize)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
  ])

  return (
    <div
      {...props}
      ref={containerRef}
    >
      <div className={truncateIdx > 0 ? undefined : 'single-item'}>
        <span>
          {
            truncateIdx > 0
              ? items.slice(0, truncateIdx).join(', ')
              : items.join(', ')
          }
        </span>

        {truncateIdx > 0 && (
          <span>{trailingDots}</span>
        )}
      </div>

      {truncateIdx > 0 && (
        <Tooltip>
          <div className="tooltip-badge">
            <ItemsBadge numTruncated={items.length - truncateIdx} />
          </div>

          <div className="tooltip-content">
            {items.join(', ')}
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default styled(AutoTrimmedList)`
  align-items: center;
  display: flex;
  justify-content: space-between;

  & .single-item {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
