//

import React, {
  FC,
} from 'react'
import styled from '@emotion/styled'
import type IProps from './ItemsBadge.types'

//

const ItemsBadge: FC<IProps> = ({
  numTruncated,
  ...props
}) => {
  return (
    <span {...props} data-testid="badge">
      +
      {numTruncated}
    </span>
  )
}

export default styled(ItemsBadge)`
  flex-shrink: 0;
  padding: 2px 5px;
  border-radius: 3px;
  background-color: var(--color-primary);
  color: #f0f0f0;
  overflow: hidden;
`
