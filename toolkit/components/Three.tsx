import { computed, initial, Layout, LayoutProps, signal } from '@canvas-commons/2d';
import { createSignal, SimpleSignal } from '@canvas-commons/core';
import * as THREE from 'three/webgpu';
import { Camera, Color, OrthographicCamera, PerspectiveCamera, Scene } from 'three/webgpu';
import { WebGPURenderer } from 'three/webgpu';

interface RenderCallback {
    (renderer: WebGPURenderer, scene: Scene, camera: Camera): void | Promise<void>;
}

export interface ThreeProps extends LayoutProps {
    scene?: Scene;
    camera?: Camera;
    quality?: number;
    background?: string;
    zoom?: number;
    onRender?: RenderCallback;
}

export class Three extends Layout {
    @initial(1) @signal() public declare readonly quality: SimpleSignal<number, this>;
    @initial(null) @signal() public declare readonly camera: SimpleSignal<Camera | null, this>;
    @initial(null) @signal() public declare readonly scene: SimpleSignal<Scene | null, this>;
    @initial(null) @signal() public declare readonly background: SimpleSignal<string | null, this>;
    @initial(1) @signal() public declare readonly zoom: SimpleSignal<number, this>;

    private renderer: WebGPURenderer | null = null;
    private isInitialized = false;
    private readonly renderCount = createSignal(0);
    public onRender: RenderCallback;

    public constructor({ onRender, ...props }: ThreeProps) {
        super(props);
        this.onRender = onRender ?? ((renderer, scene, camera) => renderer.render(scene, camera));

        // Begin asynchronous renderer setup
        borrow().then(async (res) => {
            this.renderer = res;
            if (!this.renderer.hasFeature('adapter')) {
                await this.renderer.init();
            }
            this.isInitialized = true;
            this.rerender();
        });
    }

    public rerender() {
        this.renderCount(this.renderCount() + 1);
    }

    protected override draw(context: CanvasRenderingContext2D) {
        const { width, height } = this.computedSize();
        this.renderCount(); // Establishes reactive timeline dependency tracking

        const quality = this.quality();
        const scene = this.configuredScene();
        const camera = this.configuredCamera();
        const renderer = this.renderer;

        if (this.isInitialized && renderer && width > 0 && height > 0 && scene && camera) {
            const size = this.computedSize();
            renderer.setSize(size.width * quality, size.height * quality, false);

            this.onRender(renderer, scene, camera);
            context.imageSmoothingEnabled = false;
            context.drawImage(
                renderer.domElement,
                0, 0,
                quality * width, quality * height,
                width / -2, height / -2,
                width, height,
            );
        }
        super.draw(context);
    }

    @computed()
    private configuredCamera(): Camera {
        const size = this.computedSize();
        const camera = this.camera();
        if (!camera) return this.camera()!;

        const ratio = size.width / size.height;
        const scale = this.zoom() / 2;
        if (camera instanceof OrthographicCamera) {
            camera.left = -ratio * scale;
            camera.right = ratio * scale;
            camera.bottom = -scale;
            camera.top = scale;
            camera.updateProjectionMatrix();
        } else if (camera instanceof PerspectiveCamera) {
            camera.aspect = ratio;
            camera.updateProjectionMatrix();
        }
        return camera;
    }

    @computed()
    private configuredScene(): Scene | null {
        const scene = this.scene();
        const background = this.background();
        if (scene) {
            scene.background = background ? new Color(background) : null;
        }
        return scene;
    }

    public override dispose() {
        if (this.renderer) {
            dispose(this.renderer);
        }
        super.dispose();
    }
}

const pool: WebGPURenderer[] = [];
async function borrow(): Promise<WebGPURenderer> {
    if (pool.length) {
        return pool.pop()!;
    } else {
        const renderer = new WebGPURenderer({
            canvas: document.createElement('canvas'),
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        await renderer.init();
        return renderer;
    }
}

function dispose(renderer: WebGPURenderer) {
    pool.push(renderer);
}
