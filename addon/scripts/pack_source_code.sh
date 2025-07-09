#!/bin/bash
BASE_FOLDER='../'
SOURCE_PATH=$BASE_FOLDER'addon/'
DESTINATION_PATH=$BASE_FOLDER'iases3addon_source_code_for_upload'
ZIP_FILENAME=$BASE_FOLDER'../iases3addon_source_code.zip'

rm -rf $DESTINATION_PATH

echo "- Copying project to temporary folder $DESTINATION_PATH"
rsync -a --exclude='.*' --exclude='*.xpi' --exclude='TODO.md' --exclude='node_modules' --exclude='addon_build' --exclude='scripts' $SOURCE_PATH $DESTINATION_PATH

cd $DESTINATION_PATH && ./cleanProject.sh

echo "- Compressing cleaned source files folder into file $ZIP_FILENAME"
rm $ZIP_FILENAME 2>/dev/null
zip -r $ZIP_FILENAME . >/dev/null

cd ../addon
echo "- Removing temporary folder $DESTINATION_PATH"
rm -rf $DESTINATION_PATH
