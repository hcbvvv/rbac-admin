import React from 'react'
import { Card, Form, Button, Switch, Select, Typography, Divider } from 'antd'
import { SettingOutlined, SaveOutlined } from '@ant-design/icons'
import styles from '../profile.module.less'

const { Title } = Typography
const { Option } = Select

/**
 * 个人设置组件
 */
const PersonalSettings = ({ loading, form, onSubmit }) => {
  return (
    <Card className={styles.settingsCard}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className={styles.settingsForm}
      >
        {/* 基础设置 */}
        <div className={styles.settingsSection}>
          <Title level={5} className={styles.sectionTitle}>
            <SettingOutlined style={{ marginRight: 8 }} />
            基础设置
          </Title>
          
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>界面语言</div>
              <div className={styles.settingDescription}>选择系统界面显示语言</div>
            </div>
            <Form.Item name="language" noStyle>
              <Select style={{ width: 120 }} className={styles.settingControl}>
                <Option value="zh-CN">中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            </Form.Item>
          </div>

          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>主题模式</div>
              <div className={styles.settingDescription}>选择界面主题模式</div>
            </div>
            <Form.Item name="theme" noStyle>
              <Select style={{ width: 120 }} className={styles.settingControl}>
                <Option value="light">浅色</Option>
                <Option value="dark">深色</Option>
                <Option value="auto">跟随系统</Option>
              </Select>
            </Form.Item>
          </div>

          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>自动登出</div>
              <div className={styles.settingDescription}>无操作后自动登出时间（分钟）</div>
            </div>
            <Form.Item name="autoLogout" noStyle>
              <Select style={{ width: 120 }} className={styles.settingControl}>
                <Option value={15}>15分钟</Option>
                <Option value={30}>30分钟</Option>
                <Option value={60}>60分钟</Option>
                <Option value={120}>2小时</Option>
                <Option value={0}>不自动登出</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <Divider />

        {/* 通知设置 */}
        <div className={styles.settingsSection}>
          <Title level={5} className={styles.sectionTitle}>
            通知设置
          </Title>

          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>邮件通知</div>
              <div className={styles.settingDescription}>接收重要消息的邮件通知</div>
            </div>
            <Form.Item name="emailNotification" valuePropName="checked" noStyle>
              <Switch className={styles.settingControl} />
            </Form.Item>
          </div>

          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>短信通知</div>
              <div className={styles.settingDescription}>接收关键操作的短信提醒</div>
            </div>
            <Form.Item name="smsNotification" valuePropName="checked" noStyle>
              <Switch className={styles.settingControl} />
            </Form.Item>
          </div>

          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>系统通知</div>
              <div className={styles.settingDescription}>接收系统内的消息通知</div>
            </div>
            <Form.Item name="systemNotification" valuePropName="checked" noStyle>
              <Switch className={styles.settingControl} />
            </Form.Item>
          </div>
        </div>

        <div className={styles.settingsSubmit}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
          >
            保存设置
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default PersonalSettings