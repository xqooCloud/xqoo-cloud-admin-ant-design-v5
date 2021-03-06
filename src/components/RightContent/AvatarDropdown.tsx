import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, useModel } from 'umi';
import { outLogin } from '@/services/login';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { removeCacheCurrentUser } from '@/services/user';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOutHandle = async () => {
  await removeCacheCurrentUser('current');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const loginOut = async () => {
    const res = await outLogin();
    if (res.code !== 200) {
      console.log('loginOut error!', res.code, res.message);
    }
    setInitialState({
      ...initialState,
      menuData: [],
      settings: {
        title: '正在退出',
        menu: {
          loading: true,
        },
      },
    });
    const hide = message.loading('正在注销...', 0);
    await loginOutHandle();
    setTimeout(() => {
      setTimeout(hide, 10);
      setInitialState({
        ...initialState,
        menuData: [],
        settings: {
          title: '登录系统',
          menu: {
            locale: false,
            loading: false,
          },
        },
      });
      const { query, pathname } = history.location;
      const { redirect } = query;
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/auth/login' && !redirect) {
        history.replace({
          pathname: '/auth/login',
          search: stringify({
            redirect: pathname,
          }),
        });
      }
    }, 1500);
  };
  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userId) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.userName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
