<script setup lang="ts">
import { computed, ref } from 'vue';
import { generateImage, conversation } from './api'
import { NSpin } from 'naive-ui'

const imgSrc = ref<string>("")
const text = ref<string>("")
const answer = ref<string>("")
const answerBox = ref<HTMLElement>()
const imageLoading = ref<boolean>(false)
const answerLoading = ref<boolean>(false)
const globalLoading = computed(() => {
    return imageLoading.value || answerLoading.value
})
const check = () => {
    if (globalLoading.value) return
    reset()
    getImage()
    analyse()
}

const reset = () => {
    answer.value = ""
    imgSrc.value = ""
}

const getImage = () => {
    imageLoading.value = true
    generateImage(text.value).then(res => {
        imgSrc.value = res.data.data
    }).finally(() => {
        imageLoading.value = false
    })
}

const analyse = () => {
    answerLoading.value = true
    conversation(text.value, str => {
        if (answerLoading.value) {
            answerLoading.value = false
        }
        answer.value += str
        if (answerBox.value) {
            answerBox.value.scrollTop = answerBox.value.scrollHeight
        }
    })
}
</script>

<template>
    <div id="container">
        <div class="left box">
            <h2 class="text-xl">图片</h2>
            <n-spin size="large" v-show="imageLoading" />
            <img v-if="imgSrc" :src="imgSrc" alt="pic">
        </div>
        <div class="right box" ref="answerBox">
            <h2 class="text-xl">解析</h2>
            <n-spin size="large" v-show="answerLoading" />
            <p class="answer">
                {{ answer.trim() }}
            </p>
        </div>
    </div>
    <div id="action">
        <input type="text" name="" id="" v-model="text" @keydown.enter="check" placeholder="试着说句英语吧 例如: three cats">
        <n-spin :show="globalLoading" size="small">
            <button @click="check">Check</button>
        </n-spin>
    </div>
</template>

<style scoped lang="less">
#container {
    display: flex;
    width: 800px;
    height: 400px;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);

    >.box {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        text-align: center;
    }

    .left {
        border: 2px solid sandybrown;
    }

    .right {
        border: 2px solid skyblue;
        white-space: pre-line;
        overflow-y: auto;
        color: aqua;
        user-select: none;

        .answer {
            padding: 6px;
        }
    }

}

#action {
    position: absolute;
    top: 520px;
    left: 50%;
    transform: translateX(-50%);

    input {
        margin-right: 15px;
        padding: 0.6em 1.2em;
        width: 400px;
    }

    .n-spin-container {
        display: inline-block;
    }
}
</style>
