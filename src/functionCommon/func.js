export function format_time(pub_time) {

    const diffInMs = new Date() - new Date(pub_time);

    const diffInMin = Math.floor(diffInMs / (1000 * 60));
    if (diffInMin < 60) { return diffInMin + " min ago" }

    const diffInHr = Math.floor(diffInMin / 60);
    if (diffInHr < 24) { return diffInHr + "h ago"; }

    const diffInDays = Math.floor(diffInHr / 24);
    if (diffInDays < 30) { return diffInDays + "day ago"; }

    const diffInMon = Math.floor(diffInDays / 30);
    if (diffInMon < 12) { return diffInMon + "month ago"; }

    const diffInyear = diffInMon / 12;
    return diffInyear.toFixed(1) + "Year ago";

}

export function format_view(view) {
    if (view < 1000) {
        return view + " views";
    } else if (view >= 1000 && view < 1000000) {
        view = (view / 1000);
        return view.toFixed(1) + "K views";
    } else {
        view = (view / 1000000);
        return view.toFixed(2) + "M views";
    }
}

export const parseISO8601Duration = (duration) => {
    // console.log("duration", duration)
    const matches = duration.match(/[0-9]+[HMS]/g);
    // console.log("matches", matches)

    let timeString = "";
    if (matches) {
        matches.forEach((match) => {
            const unit = match.charAt(match.length - 1);
            const value = parseInt(match.slice(0, -1));

            if (unit === "H") timeString += value + ":";//hours
            else if (unit === "M") timeString += value + ":";//mins
            else if (unit === "S") timeString += value + "";//sec
        });
    }
    // console.log(timeString)
    return timeString.trim();
}

export function format_like(view) {
    if (view < 1000) {
        return view + "";
    } else if (view >= 1000 && view < Math.pow(10, 6)) {
        view = (view / 1000);
        return view.toFixed(1) + "K";
    } else {
        view = (view / Math.pow(10, 6));
        return view.toFixed(2) + "M";
    }
}