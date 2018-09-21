$(document).ready(function () {
    var $ProductNumber = $("#ProductNumber");
    var $SaveButton = $("#SaveButton");btnSave
    var $DiscardLogobutton = $("#DiscardLogobutton");
    var $PreBack = $("#PreBack");
    var $UnitPrice = $("#UnitPrice");
    var $Width = $("#Width");
    var $Length = $("#Length");
    var $Height = $("#Height");
    var $ProductNumberlbl = $("#ProductNumberlbl");
    var $PackSize = $("#PackSize");
    var $Description = $("#Description");
    var $CostCenterCode = $("#CostCenterCode");
    var $ExpirationDate = $("#ExpirationDate");


    function PreviewImageBeforeUpload() {
        $("#inputFile").change(function () {
            readURL(this);
        });
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#image_upload_preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function LoadBasicInformationFromProductNumber() {
        var intProductNumberUI = $("#ProductNumber").val();
        var PackSize = $("#PackSize");
        var Description = $("#Description");
        var CostCenterCode = $("#CostCenterCode");
        var UnitPrice = $("#UnitPrice");
        var Width = $("#Width");
        var Height = $("#Height");
        var Length = $("#Length");
        var Cube = $("#Cube");
        var ExpirationDate = $("#ExpirationDate");
        var HazardousMeterial = $("#HazardousMeterial");
        var PreBack = $("#PreBack");
        var image_upload_preview = $("#image_upload_preview");

        if (intProductNumberUI != "") {
            var GridInventory = $("#GridInventory");

            GridInventory.GridUnload();
            $.ajax({
                type: 'GET',
                url: 'api/ItemMaster/' + intProductNumberUI,
                dataType: 'json',
                success: function (data) {
                    if (data != null) {
                        var intProductNumber = data["ItemMasterID_PK"];
                        PackSize.val(data["IMPack"]);
                        Description.val(data["IMDescription"]);
                        CostCenterCode.val(data["IMCostCenterCode"]);
                        UnitPrice.val(parseFloat(data["IMUnitPrice"]).toFixed(2));
                        Width.val(parseFloat(data["IMWidth"]).toFixed(2));
                        Height.val(parseFloat(data["IMHeight"]).toFixed(2));
                        Length.val(parseFloat(data["IMLength"]).toFixed(2));
                        Cube.val(parseFloat(data["IMWidth"] * data["IMHeight"] * data["IMLength"]).toFixed(3));
                        var strExpirationDate;
                        if (data["MExpirationDate"] != null) {
                            var inputExpirationDate = data["MExpirationDate"].split("-");
                            strExpirationDate = inputExpirationDate[0] + "-" + inputExpirationDate[1] + "-" + inputExpirationDate[2].substring(0, 2);
                        }
                        else {
                            strExpirationDate = null;
                        }
                        ExpirationDate.val(strExpirationDate);
                        HazardousMeterial.prop('checked', (data["IMIsHazardousMaterial"]));
                        PreBack.prop('checked', (data["IMIsPrePack"]));
                        var src;
                        if (data["IMImageData"] != "") {
                            src = "data:image/jpeg;base64,";
                            src += data["IMImageData"];
                        }
                        else {
                            src = "http://placehold.it/100x100";
                        }
                        image_upload_preview.attr("src", src);

                        LoadInventoryGird(intProductNumberUI);
                    }

                    if (data == null) {
                        ResetUI();
                    }
                }
            });
        }
        else {
            ResetUI();
        }
    }

    function SaveBasicInformation() {
        var intItemMasterIDPK = $("#ProductNumber").val();
        if (intItemMasterIDPK != "") {
            var intIMPack = $("#PackSize").val();
            var strIMDescription = $("#Description").val();
            var image_upload_preview = $("#image_upload_preview");
            var blIMIsHazardousMaterial;
            if ($("#HazardousMeterial").is(":checked")) {
                blIMIsHazardousMaterial = true;
            }
            else {
                blIMIsHazardousMaterial = false;
            }

            var strMExpirationDate = $("#ExpirationDate").val();
            var decimalIMUnitPrice = $("#UnitPrice").val();
            var decimalIMWidth = $("#Width").val();
            var decimalIMLength = $("#Length").val();
            var decimalIMHeight = $("#Height").val();
            var blIMIsPrePack;
            if ($("#PreBack").is(":checked")) {
                blIMIsPrePack = true;
            }
            else {
                blIMIsPrePack = false;
            }
            var strIMPrePackStyle = $("#PreBackStyle").val();
            var strIMCostCenterCode = $("#CostCenterCode").val();
            var strIMImageData = GetResourceAndReduceSizeImage();

            var objItemMaster = new Object();
            objItemMaster.ItemMasterID_PK = intItemMasterIDPK;
            objItemMaster.IMPack = intIMPack;
            objItemMaster.IMDescription = strIMDescription;
            objItemMaster.IMImageData = strIMImageData;
            objItemMaster.IMIsHazardousMaterial = blIMIsHazardousMaterial;
            objItemMaster.MExpirationDate = strMExpirationDate;
            objItemMaster.IMUnitPrice = decimalIMUnitPrice;
            objItemMaster.IMWidth = decimalIMWidth;
            objItemMaster.IMLength = decimalIMLength;
            objItemMaster.IMHeight = decimalIMHeight;
            objItemMaster.IMIsPrePack = blIMIsPrePack;
            objItemMaster.IMPrePackStyle = strIMPrePackStyle;
            objItemMaster.IMCostCenterCode = strIMCostCenterCode;
            SaveItemMaster(objItemMaster);
        }
    }

    function SaveItemMaster(objItemMaster) {
        var GridInventory = $("#GridInventory");
        $.ajax({
            url: "SaveItemMaster",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(objItemMaster),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //Load cube data after create or update
                $("#Cube").val(parseFloat(objItemMaster.IMWidth * objItemMaster.IMHeight * objItemMaster.IMLength).toFixed(3));
                $.ajax({
                    type: 'GET',
                    url: 'api/ItemMasterInventoryID/' + objItemMaster.ItemMasterID_PK,
                    dataType: 'json',
                    success: function (girddata) {
                        GridInventory.jqGrid('setGridParam', {
                            datatype: 'local',
                            data: girddata
                        })
                        .trigger("reloadGrid");
                    }
                });
                $("#SaveDialog p").text(data);
                $("#SaveDialog").dialog({
                    position: { my: "center", at: "top" },
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });

            }
        });
    }

    function DiscardLogo() {
        $('#image_upload_preview').attr('src', "http://placehold.it/100x100");
        $('#inputFile').val("");
    }

    function SetTwoNumberDecimalFormatInput() {
        console.log(event.currentTarget);
        event.currentTarget.value = parseFloat(event.currentTarget.value).toFixed(2);
        var decimalIMWidth = $("#Width").val();
        var decimalIMLength = $("#Length").val();
        var decimalIMHeight = $("#Height").val();
        $("#Cube").val(parseFloat(decimalIMWidth * decimalIMLength * decimalIMHeight).toFixed(3));
    }

    function GetResourceAndReduceSizeImage() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var cw = canvas.width;
        var ch = canvas.height;
        var strIMImageData;
        if (document.getElementById("image_upload_preview").src == "http://placehold.it/100x100") {
            strIMImageData = "";
        }
        else {
            var maxW = 100;
            var maxH = 80;

            var img = new Image;
            img.src = document.getElementById("image_upload_preview").src;
            img.width = 100;
            img.height = 100;
            var iw = img.width;
            var ih = img.height;
            var scale = Math.min((maxW / iw), (maxH / ih));
            var iwScaled = iw * scale;
            var ihScaled = ih * scale;
            canvas.width = iwScaled;
            canvas.height = ihScaled;
            ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
            strIMImageData = canvas.toDataURL().replace("data:image/png;base64,", "");
        }
        return strIMImageData;
    }

    function ValidationCostCenterCode() {
        $('#CostCenterCode').mask('0000-00-00');
    }

    function AutoCompleteProductNumberInput() {

        $("#ProductNumber").autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: 'GET',
                    url: 'GetItemMasterLikeId/' + $("#ProductNumber").val(),
                    dataType: 'json',
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                value: item["ItemMasterID_PK"],
                                label: item["ItemMasterID_PK"]
                            };
                        }));
                    }
                });
            }
        });
    }

    function CheckPreBackChange() {
        var isChecked = $("#PreBack").is(':checked');
        if (!isChecked) {
            $("#PreBackStyle").attr('disabled', 'disabled');
        }
        else {
            $("#PreBackStyle").removeAttr('disabled');
        }
    }

    function LoadInventoryGird(intProductNumberUI) {
        var GridInventory = $("#GridInventory");
        $.ajax({
            type: 'GET',
            url: 'api/ItemMasterInventoryID/' + intProductNumberUI,
            dataType: 'json',
            success: function (data) {
                GridInventory.jqGrid({
                    colModel: [
                        { name: "Location" },
                        { name: "OnHand" },
                        { name: "OnHandPcs" },
                        { name: "Allocated" },
                        { name: "AllocationPcs" },
                        { name: "Available" },
                        { name: "AvailablePcs" }
                    ],
                    data: data,
                    footerrow: true,
                    loadComplete: function () {
                        var $self = $(this);
                        $self.jqGrid("footerData", "set", {
                            Location: "ALL SITE",
                            OnHand: parseFloat($self.jqGrid("getCol", "OnHand", false, "sum")),
                            OnHandPcs: parseFloat($self.jqGrid("getCol", "OnHandPcs", false, "sum")),
                            Allocated: parseFloat($self.jqGrid("getCol", "Allocated", false, "sum")),
                            AllocationPcs: parseFloat($self.jqGrid("getCol", "AllocationPcs", false, "sum")),
                            Available: parseFloat($self.jqGrid("getCol", "Available", false, "sum")),
                            AvailablePcs: parseFloat($self.jqGrid("getCol", "AvailablePcs", false, "sum"))

                        });
                    }
                });
            }
        });
    }

    function ResetUI() {
        var PackSize = $("#PackSize");
        var Description = $("#Description");
        var CostCenterCode = $("#CostCenterCode");
        var UnitPrice = $("#UnitPrice");
        var Width = $("#Width");
        var Height = $("#Height");
        var Length = $("#Length");
        var Cube = $("#Cube");
        var ExpirationDate = $("#ExpirationDate");
        var HazardousMeterial = $("#HazardousMeterial");
        var PreBack = $("#PreBack");
        var GridInventory = $("#GridInventory");

        PackSize.val("");
        Description.val("");
        CostCenterCode.val("");
        UnitPrice.val("");
        Width.val("");
        Height.val("");
        Length.val("");
        Cube.val("0");
        ExpirationDate.val("");
        HazardousMeterial.prop('checked', false);
        PreBack.prop('checked', false);
        GridInventory.GridUnload();
        DiscardLogo();
    }

    PreviewImageBeforeUpload();
    AutoCompleteProductNumberInput();
    ValidationCostCenterCode();
    CheckPreBackChange();

    $ProductNumber.on("blur", function () {
        LoadBasicInformationFromProductNumber();
    });

    $SaveButton.on("click", function () {
        SaveBasicInformation();
    });

    $DiscardLogobutton.on("click", function () {
        DiscardLogo();
    });

    $PreBack.on("change", function () {
        CheckPreBackChange();
    });

    $UnitPrice.on("change", function (event) {
        SetTwoNumberDecimalFormatInput(event);
    });

    $Width.on("change", function (event) {
        SetTwoNumberDecimalFormatInput(event);
    });

    $Length.on("change", function (event) {
        SetTwoNumberDecimalFormatInput(event);
    });

    $Height.on("change", function (event) {
        SetTwoNumberDecimalFormatInput(event);
    });

});