import React, { FC } from 'react';

import { Props } from './layout-types';
import { Main } from './layout-styles';

const Layout: FC<Props> = ({ children }) => <Main>{children}</Main>;

export default Layout;
