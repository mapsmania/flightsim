export default class FlightController {
    constructor(map, options = {}) {
        this.map = map;

        // Configurable parameters
        this.speed = options.speed || 0.0005;
        this.minSpeed = options.minSpeed || 0.00005;
        this.maxSpeed = options.maxSpeed || 0.01;

        this.bearing = options.bearing ?? map.getBearing();
        this.pitch = options.pitch ?? map.getPitch();

        this.pitchMin = options.pitchMin || 30;
        this.pitchMax = options.pitchMax || 85;

        this.turnRate = options.turnRate || 2;
        this.acceleration = options.acceleration || 1.1;
        this.deceleration = options.deceleration || 0.9;

        this.running = false;

        // Bind methods
        this._loop = this._loop.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    start() {
        if (this.running) return;
        this.running = true;

        window.addEventListener('keydown', this._onKeyDown);
        requestAnimationFrame(this._loop);
    }

    stop() {
        this.running = false;
        window.removeEventListener('keydown', this._onKeyDown);
    }

    _loop() {
        if (!this.running) return;

        const center = this.map.getCenter();

        const rad = this.bearing * Math.PI / 180;

        const lng = center.lng + Math.sin(rad) * this.speed;
        const lat = center.lat + Math.cos(rad) * this.speed;

        this.map.setCenter([lng, lat]);
        this.map.setBearing(this.bearing);
        this.map.setPitch(this.pitch);

        requestAnimationFrame(this._loop);
    }

    _onKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.speed = Math.min(this.speed * this.acceleration, this.maxSpeed);
                break;

            case 'ArrowDown':
                this.speed = Math.max(this.speed * this.deceleration, this.minSpeed);
                break;

            case 'ArrowLeft':
                this.bearing -= this.turnRate;
                break;

            case 'ArrowRight':
                this.bearing += this.turnRate;
                break;

            case 'w':
                this.pitch = Math.min(this.pitch + 2, this.pitchMax);
                break;

            case 's':
                this.pitch = Math.max(this.pitch - 2, this.pitchMin);
                break;
        }
    }

    // Optional helpers
    setSpeed(speed) {
        this.speed = Math.max(this.minSpeed, Math.min(speed, this.maxSpeed));
    }

    setBearing(bearing) {
        this.bearing = bearing;
    }

    setPitch(pitch) {
        this.pitch = Math.max(this.pitchMin, Math.min(pitch, this.pitchMax));
    }
}