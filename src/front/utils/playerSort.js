export default function playerSort(p1, p2) {
    if (p1.score > p2.score) {
        return -1;
    } else if (p1.score == p2.score) {
        if (p1.name > p2.name) {
            return 1;
        } else {
            return -1;
        }
    } else {
        return 1;
    }
}