//

import React, {
  FC,
} from 'react'
import MUIText from '@mui/material/TextField'
import IProps from './TextField.types'

//

const TextField: FC<IProps> = ({
  autoComplete,
  InputLabelProps,
  inputRef,
  // Note: Buggy typescript compiling, so we need to destruct it to declare.
  variant,
  ...props
}) => {
  const shrinkLabel = InputLabelProps?.shrink || !!inputRef?.current?.value

  return (
    <MUIText
      {...props}
      autoComplete={autoComplete ?? 'off'}
      InputLabelProps={!shrinkLabel ? InputLabelProps : {
        ...InputLabelProps,
        shrink: true,
      }}
      inputRef={inputRef}
      variant={variant ?? 'outlined'}
    />
  )
}

export default TextField
