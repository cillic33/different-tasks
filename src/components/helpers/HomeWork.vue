<template>
  <div class="content">

    <h2>Идентификатор инстанса {{ id }}</h2>
    <br>

    <fieldset>
      <legend>Сколько раз была нажата кнопка</legend>
      <h1>{{ counter }}</h1>
    </fieldset>

    <fieldset>
      <legend>Случайное число</legend>
      <h1>{{ random }}</h1>
    </fieldset>

    <fieldset>
      <legend>Каждые 5 нажатий, но не более 15, будет показываться модальное окно</legend>
      <button type="button" @click="onButtonClick">Сгенерировать число</button>
    </fieldset>


    <br>
    <button type="button" @click="onButtonClickMyau">Скажи мяу!</button>
    <br>
    <button type="button" @click="onButtonClickEmit">Emitter</button>
    <br>
    <button type="button" @click="onButtonAttrs">Показать Attrs</button>
    <br><br>


    <div>Год {{ year }}</div>
    <br>
    <div>Состояние: {{ state.message }}, {{ state.nested.deep.mess }}</div>
    <br>
    <button type="button" @click="onButtonYear">Изменить год</button>
    <br>
    <button type="button" @click="onButtonState">Изменить состояние</button>

  </div>
</template>

<script>
import {ref, defineComponent, watch, getCurrentInstance, reactive} from 'vue';

export default defineComponent({
  props: {
    title: {type: String,}
  },
  emits: ['some-event'],
  setup(props, { emit, attrs, slots }) {
    const counter = ref(0);
    const random = ref(0);
    const id = getCurrentInstance().uid;
    const year = ref(2023);
    const state = reactive({
      message: 'Тут сообщение',
      nested: {
        deep: {
          mess: 'Вложенное сообщение',
        }
      }
    });

    watch(counter, (value, oldValue, onInvalidate) => {
      onInvalidate(() => {
        console.log('Данные изменены');
      });
      if (value % 5 === 0 && value <= 15) {
        alert('Вы молодец!');
      }
    });

    const onButtonClick = () => {
      counter.value += 1;
      random.value = Math.floor(Math.random() * 100);
    };

    const onButtonClickEmit = () => {
      emit('some-event');
    };

    const onButtonAttrs = () => {
      console.log(attrs);
    };

    const onButtonYear = () => {
      year.value = Math.floor(Math.random() * 100) + 2000;
    }

    const onButtonState = () => {
      state.message = 'Сообщение измененено';
      state.nested.deep.mess = 'Вложенное сообщение изменено';
    }


    return {
      counter,
      random,
      id,
      year,
      state,
      onButtonClick,
      onButtonClickMyau: () => {
        alert('Мяу');
      },
      onButtonClickEmit,
      onButtonAttrs,
      onButtonYear,
      onButtonState,
    }
  },
})
</script>

<style lang="stylus" scoped>
.content
  text-align left
</style>
