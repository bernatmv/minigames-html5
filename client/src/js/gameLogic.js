import * as Rx from 'rx';

export default function gameLogic(source) {
    const observer = Rx.Observer.create(
        (x) => console.log('Next', x),
        (err) => console.log('Error', err),
        () => console.log('Completed')
    );
    const subscription = source.subscribe(observer);
}