<? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
?>
    <script src="/local/components/rent21/ymap/js/ymap.js"></script>
    <style type="text/css">
        #mapFarmer {
            width: 100%;
            height: 500px;
            border: 1px solid;
        }
    </style>
    <div id="mapFarmer"></div>
    
    <script>
        $(document).ready(function() {
            $('#mapFarmer').farmer({
                'ymapkey': "fdb945b0-aaa5-4b5d-a837-383abb24dfc4",
                'centermap': [55.76, 37.64],
                'poligon': [
                    [
                        [55.75, 37.50],
                        [55.80, 37.60],
                        [55.75, 37.70],
                        [55.70, 37.70],
                        [55.70, 37.50]
                    ]
                ]
            });
        });
    </script>    
    
<?
?>