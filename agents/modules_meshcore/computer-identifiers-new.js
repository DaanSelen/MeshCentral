function linux_identifiers() {
    var fs = require('fs');
    var identifiers = {};
    var ret = {};
    var values = {};
    var child = null;

    // Check if the /sys/class/dmi/id path exists
    if (!fs.existsSync('/sys/class/dmi/id')) {

        // Check if the /sys/firmware/devicetree/base/model path exists exists
        // Most likely because of a Raspberry Pi device
        if (fs.existsSync('/sys/firmware/devicetree/base/model')) {

            // Raspberry Pi
            // Check if the file at /sys/firmware/devicetree/base/model actually contains the 'Raspberry' string
            if (fs.readFileSync('/sys/firmware/devicetree/base/model').toString().trim().startsWith('Raspberry')) {

                // Basic hardware information, Board Vendor, Board Name, Board Serial Number
                identifiers['board_vendor'] = 'Raspberry Pi Foundation';
                identifiers['board_name'] = fs.readFileSync('/sys/firmware/devicetree/base/model').toString().trim();
                identifiers['board_serial'] = fs.readFileSync('/sys/firmware/devicetree/base/serial-number').toString().trim();

                // Memory information by reading the /proc/meminfo
                var memInfo = fs.readFileSync('/proc/meminfo').toString().trim().split('\n');
                var rawTotalMemory = null;
                for (var i = 0; i < memInfo.length; i++) {
                    if (memInfo[i].indexOf('MemTotal:') !== -1) {
                        rawTotalMemory = memInfo[i].split(':')[1].trim().split(' ')[0];
                        break;
                    }
                }
                var totalMemory = rawTotalMemory / (1024 * 1024)


                console.log(totalMemory)
            }
        }
    }
}
linux_identifiers()