define(function () {
    function getMonday(d) {
        d = new Date(d);
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }
    return {
        getMonday: getMonday,
    }
});
