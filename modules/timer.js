export class Timer {
  #hour;
  #minute;
  #second;
  #liveCountEl;
  #callback;
  /**
   * @param hour represent the remaining hour time
   * @param minute represent the remaining minutes
   * @param second represent the remaining seconds
   * @param liveCountEl represent the Element that will show the timer
   * @param callback function that will execute when the timer finished
   */
  constructor(hour, minute, second, liveCountEl, callback) {
    this.#hour = hour;
    this.#minute = minute;
    this.#second = second;
    this.#liveCountEl = liveCountEl;
    this.#callback = callback;
  }
  /**
   *
   * @returns if timer finished or not
   */
  isFinished() {
    return this.#hour == 0 && this.#minute == 0 && this.#second == 0;
  }
  /**
   *
   * @returns the timer with format HH:MM:SS
   */
  toStringHHMMSS() {
    const hourText = this.#hour > 9 ? this.#hour : `0${this.#hour}`;
    const minuteText = this.#minute > 9 ? this.#minute : `0${this.#minute}`;
    const secondText = this.#second > 9 ? this.#second : `0${this.#second}`;
    return `${hourText}:${minuteText}:${secondText}`;
  }
  /**
   * render the timer in the Element
   */
  renderLiveCount() {
    this.#liveCountEl.textContent = this.toStringHHMMSS();
  }

  /**
   * pulse one second each time until the timer finished
   * when finished callback
   */
  pulse() {
    setTimeout(() => {
      this.downSecond();
      if (!this.isFinished()) {
        this.pulse();
      } else {
        this.#callback();
      }
    }, 1000);
    this.renderLiveCount();
  }
  /**
   * down one second from the timer
   */
  downSecond() {
    if (this.#second == 0) {
      this.#minute -= 1;
      this.#second = 59;
    } else {
      this.#second -= 1;
    }
    if (this.#minute == -1) {
      this.#hour -= 1;
      this.#minute = 59;
    }
  }
  /**
   * start the timer
   */
  startTimer() {
    this.pulse();
  }
}
