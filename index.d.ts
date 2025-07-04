declare module "image-slider-scale" {
    /**
     * 图片对比
     * @param {string} domId - 目标 DOM 元素的 ID
     * @param {string} originalImg - 原图(顶图)
     * @param {string} generateImg - 生成图(底图)
     */
    export default function imageSliderScale(
        domId: string,
        originalImg: string,
        generateImg: string
    ): void;
}