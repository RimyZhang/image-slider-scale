/**
 * 图片对比功能，支持缩放及拖拽移动
 * @param {string} domId - 目标 DOM 元素的 ID
 * @param {string} originalImg - 原图(顶图)
 * @param {string} generateImg - 生成图(底图)
 */

export default function imageSliderScale(domId, originalImg, generateImg) {
    const target = document.getElementById(domId);
    if (!target) {
        console.warn(`[image-slider-scale] DOM with id "${domId}" not found.`);
        return false;
    }
    target.innerHTML = `
    <style>
        .compare-box {
            position: relative;
            overflow: hidden;
            user-select: none;
            height: 100%;
        }
        .compare-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .compare-result {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            clip-path: inset(0px 0px 0px 50%);
        }

        .compare-bar {
            cursor: ew-resize;
            position: absolute;
            top: 0;
            left: 50%;
            width: 2px;
            height: 100%;
            transform: translate(-50%);
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, .2);
            background: rgba(255, 255, 255, .5);
        }
        .btn-compare-bar {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            backdrop-filter: blur(5px);
            border-radius: 100%;
            border: 2px solid #FFF;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, .2);
        }
        .btn-compare-bar::before,
        .btn-compare-bar::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 4px;
            width: 0;
            height: 0;
            font-size: 0;
            transform: translateY(-50%);
            border: 8px solid transparent;
            border-right: 8px solid #FFF;
        }

        .btn-compare-bar::after {
            left: auto;
            right: 4px;
            transform: translateY(-50%) rotate(180deg);
        }
    </style>
    <div id="image-slider-scale" class="compare-box">
        <img id="generate-img" class="compare-bg" src="${originalImg}" alt="">
        <img id="original-img" }"
            class="compare-result" src="${generateImg}" alt="" >
        <p id="slider-bar" class="compare-bar">
            <span id="slider" class="btn-compare-bar"></span>
        </p>
    </div>`;
    setTimeout(() => {
        var isMouseMoveImg = false
        var isMouseMoveBar = false
        var startX = 0
        var startY = 0
        var moveX = 0
        var moveY = 0
        var translateX = 0
        var translateY = 0
        var moveLeft = '50%'
        var clipPath = '50%'
        var startClipPath = 0
        var width = 0
        var left = 0
        var scale = 1
        const dom = document.getElementById('image-slider-scale');
        const generateImg = document.getElementById('generate-img');
        const originalImg = document.getElementById('original-img');
        const sliderBar = document.getElementById('slider-bar');
        const slider = document.getElementById('slider');
        dom.addEventListener('mousemove', (event) => {
            if (isMouseMoveBar) {
                sliderBar.style.left = moveLeft = event.clientX - left + 'px'
                clipPath = (width * (scale - 1) / 2 + event.clientX - left) / scale - translateX + 'px'
                originalImg.style.clipPath = 'inset(0px 0px 0px ' + clipPath + ')'
            }
            if (isMouseMoveImg) {
                moveX = (event.clientX - startX) / scale
                moveY = (event.clientY - startY) / scale
                generateImg.style.transform = originalImg.style.transform = `scale(${scale}) translate(${translateX + moveX}px, ${translateY + moveY}px)`
                clipPath = Number(startClipPath.slice(0, -2)) - moveX + 'px'
                originalImg.style.clipPath = 'inset(0px 0px 0px ' + clipPath + ')'
            }
        });
        function onMouseLeaveUp() {
            if (!isMouseMoveImg) return
            translateX += moveX
            translateY += moveY
            moveX = 0
            moveY = 0
            generateImg.style.transform = originalImg.style.transform = `scale(${scale}) translate(${translateX + moveX}px, ${translateY + moveY}px)`
            isMouseMoveImg = false
            isMouseMoveBar = false
            console.log(isMouseMoveBar)
            slider.style.display = 'block'
        }
        dom.addEventListener('mouseleave', onMouseLeaveUp);
        dom.addEventListener('mouseup', onMouseLeaveUp);
        dom.addEventListener('wheel', (e) => {
            const curScale = e.deltaY > 0 ? scale - 0.1 : scale + 0.1
            if (curScale <= 5 && curScale >= 1) {
                scale = curScale
                if (moveLeft != '50%') clipPath = (width * (curScale - 1) / 2 + Number(moveLeft.slice(0, -2))) / curScale - translateX + 'px'
            }
            generateImg.style.transform = originalImg.style.transform = `scale(${scale}) translate(${translateX + moveX}px, ${translateY + moveY}px)`
            originalImg.style.clipPath = 'inset(0px 0px 0px ' + clipPath + ')'
        });
        function onmousedownImg(event) {
            isMouseMoveImg = true
            startX = event.clientX
            startY = event.clientY
            width = dom?.clientWidth
            left = dom.getBoundingClientRect().left
            if (clipPath == '50%') clipPath = width / 2 + 'px'
            startClipPath = clipPath
            originalImg.style.clipPath = 'inset(0px 0px 0px ' + clipPath + ')'
        }
        generateImg.addEventListener('mousedown', (event) => {
            event.preventDefault()
            event.stopPropagation()
            onmousedownImg(event)
        });
        originalImg.addEventListener('mousedown', (event) => {
            event.preventDefault()
            event.stopPropagation()
            onmousedownImg(event)
        });
        sliderBar.addEventListener('mousedown', (event) => {
            event.preventDefault()
            event.stopPropagation()
            isMouseMoveBar = true
            console.log(isMouseMoveBar)
            slider.style.display = 'none'
            if (clipPath == '50%') clipPath = width / 2 + 'px'
            startClipPath = clipPath
            width = dom?.clientWidth
            left = dom.getBoundingClientRect().left
            if (moveLeft == '50%') moveLeft = width / 2 + 'px'
            clipPath = (width * (scale - 1) / 2 + moveLeft) / scale - translateX + 'px'
            originalImg.style.clipPath = 'inset(0px 0px 0px ' + clipPath + ')'
        });
        sliderBar.addEventListener('mouseup', () => {
            isMouseMoveBar = false
            slider.style.display = 'block'
        });
    }, 100);
}