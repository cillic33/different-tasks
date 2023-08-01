<template>
  <div>

    <h2>Сопоставление блоков с генерацией уникального цвета</h2>

    <div class="quizzes-quiz-question__page">

      <div class="quizzes-quiz-question__content">
        <div class="quizzes-quiz-question__info">
          <div>
            <div class="quizzes-quiz-question__note">
              Кликните на любой блок в левой колонке, затем на любой блок в правой колонке.
            </div>
          </div>

          <div class="quizzes-quiz-question__answers-match">
            <div class="quizzes-quiz-question__answers-match-col quizzes-quiz-question__answers-match-col_left">
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="1" data-number="1">
                Вариант A в две строки Вариант А в две строки
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="2" data-number="2">
                Вариант B
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="3" data-number="3">
                Вариант C
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="4" data-number="4">
                Вариант D
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="5" data-number="5">
                Вариант E
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="6" data-number="6">
                Вариант F
              </div>
            </div>
            <div class="quizzes-quiz-question__answers-match-col quizzes-quiz-question__answers-match-col_right">
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант А
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант B в одну длинную строку
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант C
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант D
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант E
              </div>
              <div class="quizzes-quiz-question__answers-match-item" data-fixed="">
                Вариант F
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import $ from 'jquery';

export default defineComponent({
  setup() {
    onMounted(() => {
      if ($('.quizzes-quiz-question__page').length) {
        $('.multiple .quizzes-quiz-question__answers-images-item, .multiple .quizzes-quiz-question__answers-texts-item').click(function () {
          $(this).toggleClass('active');
        });

        $('.single .quizzes-quiz-question__answers-images-item, .single .quizzes-quiz-question__answers-texts-item').click(function () {
          $(this).parent().find('.active').removeClass('active');
          $(this).addClass('active');
        });

        const $matchItems = $('.quizzes-quiz-question__answers-match-item');

        /* Объект с установленными цветами для текущего вопроса */
        let colors = {};
        /* Количество блоков в вопросе, и соответственно - цветов */
        let colorsNumber = $('.quizzes-quiz-question__answers-match-col_left .quizzes-quiz-question__answers-match-item').length;
        /* Генерация уникальных цветов в количестве colorsNumber */
        for (let i=1; i<=colorsNumber; i++) {
          let hue = Math.floor(360/colorsNumber) * i;
          colors[i] = ['hsl(' + hue + ', 90%, 90%)', 'hsl(' + hue + ', 50%, 30%)'];
        }

        if ($matchItems.length) {
          const $leftItems = $('.quizzes-quiz-question__answers-match-col_left .quizzes-quiz-question__answers-match-item');
          const $rightItems = $('.quizzes-quiz-question__answers-match-col_right .quizzes-quiz-question__answers-match-item');
          let currentFixed = 0;
          let currentNumber = 0;

          /* Заполнение массива отступов для линий */
          let deltas = [];
          let d = 100 / ($leftItems.length + 1);
          for (let i = 0; i < $leftItems.length; i++) {
            deltas.push((i + 1) * d);
          }

          $matchItems.click(function () {
            const $item = $(this);

            /* Выбор элемента в левой колонке */
            if ($item.parent().hasClass('quizzes-quiz-question__answers-match-col_left')) {
              $leftItems.removeClass('current');
              $item.addClass('current');
              /* Получение текущего номера элемента из левой колонки */
              currentFixed = $item.attr('data-fixed');
              currentNumber = $item.attr('data-number');
              /* Поиск в правой колонке фиксированного элемента с текущим номером и сброс фиксации */
              clearFixedElements();
            }

            /* Выбор элемента в правой колонке и фиксация сопоставления */
            if ($item.parent().hasClass('quizzes-quiz-question__answers-match-col_right')) {
              if (!$item.hasClass('fixed') && currentFixed > 0) {
                $rightItems.removeClass('current');
                $item.addClass('current');

                const $leftItem = $leftItems.filter('.current');
                const $rightItem = $rightItems.filter('.current');

                /* Поиск в правой колонке фиксированного элемента с текущим номером и сброс фиксации */
                clearFixedElements();
                /* Запись текущего номера в текущий элемент из правой колонки */
                $('.quizzes-quiz-question__answers-match-col_right .quizzes-quiz-question__answers-match-item.current').attr('data-fixed', currentFixed);
                /* Фиксация текущих блоков */
                $leftItem.addClass('fixed');
                $rightItem.addClass('fixed');

                /* Установка нового цвета для выбранных элементов */
                let lightColor = colors[currentNumber][0];
                let darkColor = colors[currentNumber][1];
                $leftItem.css({'background-color': lightColor, 'color': darkColor, 'border-color': darkColor});
                $rightItem.css({'background-color': lightColor, 'color': darkColor, 'border-color': darkColor});

                /* Отрисовка новой линии */
                createLine(darkColor);
              }
            }
          });

          function clearFixedElements() {
            /* Очистка фиксации правого блока */
            let elements = $(`.quizzes-quiz-question__answers-match-col_right .quizzes-quiz-question__answers-match-item[data-fixed='${currentFixed}']`);
            if (elements.length > 0) {
              elements.each(function () {
                $(this).attr('data-fixed', '');
                $(this).removeClass('fixed');
                $(this).css({'background-color': '', 'color': '', 'border-color': ''});
              });
            }
            /* Очистка фиксации левого блока */
            const $leftItem = $leftItems.filter('.current');
            $leftItem.removeClass('fixed');
            $leftItem.css({'background-color': '', 'color': '', 'border-color': ''});
            /* Удаление блока линии с текущим номером, если он есть */
            deleteLine();
          }

          function createLine(color) {
            /* Создание нового блока линии с текущим номером */
            const line = document.createElement('div');
            line.className = 'quizzes-quiz-question__answers-match-line';
            line.dataset.fixed = currentFixed;
            const lineTop = document.createElement('div');
            lineTop.className = 'quizzes-quiz-question__answers-match-line_top';
            lineTop.style.borderColor = color;
            const lineBottom = document.createElement('div');
            lineBottom.className = 'quizzes-quiz-question__answers-match-line_bottom';
            lineBottom.style.borderColor = color;
            line.append(lineTop);
            line.append(lineBottom);
            /* Позиционирование блока линии */
            positionLine($(line));
            /* Добавление блока линии в DOM */
            const match = document.querySelector('.quizzes-quiz-question__answers-match');
            match.append(line);
          }

          function deleteLine() {
            let elements = document.querySelectorAll(`.quizzes-quiz-question__answers-match-line[data-fixed='${currentFixed}']`);
            if (elements.length > 0) {
              elements.forEach((element, i) => {
                element.remove();
              });
            }
          }

          function positionLine($line) {
            let matchClass = '.quizzes-quiz-question__answers-match';
            const $leftItem = $(matchClass + '-col_left ' + matchClass + '-item.current');
            const $rightItem = $(matchClass + '-col_right ' + matchClass + '-item.current');
            let topL = $leftItem.position().top + $leftItem.innerHeight() / 2;
            let topR = $rightItem.position().top + $rightItem.innerHeight() / 2;
            let top = (topL < topR) ? topL : topR;
            let h = (topL < topR) ? topR - topL : topL - topR;
            if (h < 6) { h = 6; }
            let cl = (topL < topR) ? '' : 'invert';
            /* Установка позиции top и высоты для блока линии */
            $line.css({top: top + 'px', height: h + 'px'});
            /* Если линия идет снизу вверх - добавление класса invert */
            $line.addClass(cl);
            /* Добавление отступов из массива deltas для внуренних блоков блока линии */
            let leftDelta = ($line.hasClass('invert')) ? 100 - deltas[currentFixed - 1] : deltas[currentFixed - 1];
            let rightDelta = ($line.hasClass('invert')) ? deltas[currentFixed - 1] : 100 - deltas[currentFixed - 1];
            $line.find(matchClass + '-line_top').css({'width': 'calc(' + leftDelta + '% - 1px)'});
            $line.find(matchClass + '-line_bottom').css({'width': 'calc(' + rightDelta + '% - 1px)'});
          }
        }
      }
    })

  },
})
</script>

<style lang="stylus">
$color-accent-accent = #fff
$color-accent-error = #C83E3E
$color-accent-brand-clarified = #026DDE
$color-accent-brand-darkened = #013B79
$color-accent-brand-faded = #5684B6
$color-accent-brand-light = #007DBB
$color-accent-faint-brand-fivefold = rgba(2, 84, 172, 0.04)
$color-brand-light-normal = #28ABEC
$color-complimentary-orange-clarified = #FF983E
$color-complimentary-orange-darkened = #D87118
$color-effect-base-near = rgba(1, 59, 121, 0.1)
$color-faint-primary = rgba(2, 84, 172, 0.5)
$color-faint-quaternary = rgba(2, 84, 172, 0.1)
$color-faint-tertiary = rgba(2, 84, 172, 0.15)
$color-faint-secondary = rgba(2, 84, 172, 0.25)
$color-on-surface-faint-tertiary = rgba(13, 31, 51, 0.05)
$color-on-surface-faint-quaternary = rgba(13, 31, 51, 0.03)
$color-on-surface-faint-primary = rgba(13, 31, 51, 0.2)
$color-on-surface-faint-secondary = rgba(13, 31, 51, 0.1)
$color-on-surface-primary = #363B40
$color-on-surface-quaternary = #E1E7ED
$color-on-surface-secondary = #626A73
$color-on-surface-tertiary = #C1C6CC
$color-special = rgba(54, 59, 64, 0.3)
$color-surface-background = #EDF1F5
$color-surface-secondary = #F5F7FA
$color-system-error-normal = #E34F4F
$color-system-error-faint-secondary = rgba(227, 79, 79, 0.15)
$color-system-error-darkened = #AB3434
$color-system-success-normal = #009F84
$color-system-success-clarified = #00BF9F
$color-system-success-darkened = #008670
$color-system-success-faint-secondary = rgba(0, 159, 132, 0.15)
$color-system-warning-darkened = #EEAD00
$color-system-warning-faint-secondary = rgba(255, 170, 0, 0.15)
$color-text-accent-brand = #0254AC
$color-text-base-secondary = #616A73
$color-text-base-tertiary = #8391A0
$color-text-base-quaternary = #c2c7cc
$color-text-accent-faint-secondary = rgba(255, 255, 255, 0.8)
$color-text-accent-warning = #D18101
$color-user-not-online = #F6546A
$color-user-online = #b3c724

.quizzes
  &-quiz
    /* Страница вопроса */
    &-question
      &__page
        width 100%

        &-wrap
          width 100%
          background url('/local/markup/images/quizzes/quiz-bg-dottes.png') no-repeat center
          background-size 1331px
          padding 24px 80px
          position relative

          @media all and (max-width 1400px)
            padding 24px 40px

          @media all and (max-width 1000px)
            padding 24px 24px

          @media all and (max-width 600px)
            padding 24px 16px

          &::before
            content ''
            display block
            position absolute
            top 0
            left 0
            width 272px
            height 100%
            background url('/local/markup/images/quizzes/quiz-bg-line.png') no-repeat center
            background-size 272px

          &::after
            content ''
            display block
            position absolute
            top 0
            right 0
            width 280px
            height 100%
            background url('/local/markup/images/quizzes/quiz-bg-circle.png') no-repeat center top 50%
            background-size 280px

      &__panel
        position fixed
        z-index 2
        top 180px
        right 0
        display flex
        flex-direction column
        align-items end

        @media all and (max-width $xl)
          position relative
          top 0
          flex-wrap wrap
          flex-direction row
          align-items center
          justify-content space-around
          gap 20px
          width 100%
          background #ffffff
          box-shadow 0 4px 8px rgba(1, 59, 121, 0.08)
          border-radius 10px
          margin 0 0 20px 0
          padding 10px 20px

        &-title
          width 349px
          height 88px
          padding 0 32px 0 65px
          font 700 18px / 24px $inter
          color #ffffff
          margin 0 0 16px 0
          display flex
          align-items center
          background url('/local/markup/images/quizzes/quiz-panel-title-bg.png') no-repeat left top

          @media all and (max-width $xl)
            width auto
            height auto
            margin 0
            padding 0
            background none
            color $color-on-surface-primary

        &-counter
          width 316px
          height 88px
          padding 0 14px 0 51px
          font 700 24px / 32px $inter
          color $color-on-surface-primary
          display flex
          align-items center
          gap 16px
          background url('/local/markup/images/quizzes/quiz-panel-counter-bg.png') no-repeat left top

          @media all and (max-width $xl)
            background none
            padding 0
            height auto

          > div > span
            white-space nowrap

          &-title
            font 700 16px / 24px $inter
            color $color-on-surface-tertiary

        &-find-error
          width 286px
          height 56px
          padding 0 12px 11px 46px
          display flex
          align-items center
          background url('/local/markup/images/quizzes/quiz-panel-find-error-bg.png') no-repeat left top
          border-top 1px solid rgba(13, 31, 51, 0.1)

          @media all and (max-width $xl)
            background none
            border none
            padding 0
            width auto

          &-btn
            font 700 16px / 24px $inter
            color $color-text-accent-brand
            border none

            @media all and (max-width $xl)
              margin 0 auto

      &__content
        width 100%
        max-width 572px
        margin 0 auto
        position relative
        z-index 1

      &__info
        display flex
        flex-direction column
        gap 24px
        width 100%
        background #ffffff
        border-radius 12px
        box-shadow 0 4px 8px -4px rgba(1, 59, 121, 0.08)
        padding 24px
        margin-bottom 20px

      &__img
        width 100%
        height auto

      &__note
        font 600 10px / 16px $inter
        color $color-text-base-secondary
        margin 4px 0 0 0

      &__desc
        font 500 16px / 24px $inter
        color $color-on-surface-primary

      &__answers
        &-images
          display flex
          flex-wrap wrap
          gap 16px

          &-item
            width calc(50% - 16px/2)
            height 142px
            background-repeat no-repeat
            background-position center
            background-size cover
            position relative
            cursor pointer
            border-radius 12px

            @media all and (max-width 480px)
              width 100%

            &.active,
            &:hover
              opacity 0.9

            &-text
              background #ffffff
              padding 4px 10px
              font 500 12px / 16px $inter
              color $color-accent-brand-light
              border-radius 96px
              position absolute
              right 12px
              bottom 11px

              ^[-1].active &
                background $color-accent-brand-light
                color #ffffff

        &-texts
          display flex
          flex-direction column
          gap 16px

          &-item
            font 500 14px / 20px $inter
            color $color-accent-brand-light
            background $color-surface-secondary
            padding 16px 20px
            border-radius 8px
            cursor pointer

            &.active
              background #2caded
              color #fff

        &-sorts
          display flex
          flex-direction column
          gap 16px

          &-item
            font 500 14px / 20px $inter
            color $color-accent-brand-light
            background $color-surface-secondary
            padding 16px 20px
            border-radius 8px
            cursor pointer

            &.active
              background rgba(0, 171, 235, 0.15)
              border 1px dashed rgba(0, 26, 114, 0.25)
              color transparent

        &-textarea
          min-height 60px
          padding-bottom 0

        &-match
          display flex
          gap 32px
          position relative

          &-col
            width calc(100% / 2 - 32px / 2)
            display flex
            flex-direction column
            gap 16px

            &_left
              .quizzes-quiz-question__answers-match-item
                color $color-system-warning-darkened

            &_right
              .quizzes-quiz-question__answers-match-item
                color $color-accent-brand-light

          &-item
            background $color-surface-secondary
            border 1px solid $color-surface-secondary
            border-radius 8px
            font 500 14px / 20px $inter
            padding 16px 20px
            cursor pointer

            &.current
              border-color $color-faint-quaternary

            &.fixed
              border-color $color-faint-primary

          &-line
            position absolute
            top 32px
            left 269px
            width 32px
            height 82px
            display flex
            flex-direction column

            &_top
              width calc(50% + 1px)
              height 50%
              border 2px solid
              border-left none
              border-bottom none
              border-radius 0 10px 0 0

            &_bottom
              align-self end
              width calc(50% + 1px)
              height 50%
              border 2px solid
              border-right none
              border-top none
              border-radius 0 0 0 10px

            &.invert
              .quizzes-quiz-question__answers-match-line_top
                align-self end
                border 2px solid
                border-right none
                border-bottom none
                border-radius 10px 0 0 0

              .quizzes-quiz-question__answers-match-line_bottom
                align-self start
                border 2px solid
                border-left none
                border-top none
                border-radius 0 0 10px 0

      &__button
        display block
        width calc(100% - 48px)
        margin 32px auto 0
        background $color-accent-brand-light

        &:hover,
        &:focus,
        &:active:not([disabled])
          background $color-brand-light-normal

      &__popup-error
        &-label
          font 500 12px / 16px $inter
          color $color-text-base-secondary

        &-ta
          height 150px

        .modal-footer
          > button
            @media all and (max-width 344px)
              width 100%
</style>
