import React, { useMemo } from 'react';
import { Modal, Input } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import ym from 'react-yandex-metrika';

const plamyaIcon = (
  <img
    src="/images/plamya.jpg"
    style={{
      width: 22,
      borderRadius: '50%',
      float: 'left',
      marginRight: '16px',
    }}
  />
);

function getContacts() {
  Modal.confirm({
    title: 'Оставь контакты и мы с тобой свяжемся :)',
    content: (
      <>
        <Input placeholder="Имя" id="plamya-name" /> <br />
        <br />
        <Input type="tel" placeholder="Телефон или ВК" id="plamya-phone" />
      </>
    ),
    onOk: () => {
      const name = (document.getElementById('plamya-name') as HTMLInputElement)
        .value;
      const phone = (document.getElementById(
        'plamya-phone'
      ) as HTMLInputElement).value;
      if (name && phone) {
        ym('reachGoal', 'plamya_submit');
        ym('userParams', {
          plamya_name: name,
          plamya_phone: phone,
        });
      } else {
        getContacts();
      }
    },
    onCancel: () => {
      Modal.confirm({
        title: 'Если не трудно, расскажи, пожалуйста, почему?',
        content: <Input.TextArea id="plamya-reason" />,
        onOk: () => {
          const reason = (document.getElementById(
            'plamya-reason'
          ) as HTMLInputElement).value;
          console.log(reason);
          ym('userParams', {
            plamya_reason: reason,
          });
        },
      });
    },
    icon: plamyaIcon,
    okText: 'До связи :)',
    cancelText: 'Я передумал',
  });
}

export default function plamyaModal() {
  const reqNum = Number(localStorage.getItem('_ym50381566_reqNum'));
  const plamyaPopupShown = Number(localStorage.getItem('plamyaPopupShown'));
  if (
    (reqNum < 30 || plamyaPopupShown > 0) &&
    location.hostname === 'bgu.irkvuz.ru'
  ) {
    return;
  }

  localStorage.setItem('plamyaPopupShown', String(plamyaPopupShown + 1));

  const modalProps: ModalFuncProps = {
    title: 'Хочешь стать вожатым?',
    content: (
      <>
        Ездил в детские лагеря и хотел стать вожатым? <br />
        Не ездил в лагерь, но любишь детей? <br />
        Студенческий Педагогический Отряд "ПЛАМЯ"! <br />
        Мы поможем тебе провести лето с пользой и позитивом! <br />
        Каждый понедельник и четверг в 18:30 в БГУ
      </>
    ),
    okText: 'Да, хочу!',
    cancelText: 'Нет, спасибо',
    icon: plamyaIcon,
    onOk: () => {
      getContacts();
      ym('reachGoal', 'plamya_agree');
      ym('userParams', {
        wantPlamya: true,
      });
    },
    onCancel: () => {
      ym('userParams', {
        wantPlamya: false,
      });
    },
  };
  Modal.confirm(modalProps);
  ym('reachGoal', 'plamya_show');
}
