#!/bin/bash
# args[1]: path for the unittest file
# args[2]: uploads directory for the file

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Not enough arguments provided! Expecting two arguments."
    exit 1
fi

test_path="$1"
upload_dir="$2"

if [ ! -d "$upload_dir" ]; then
    echo "Uploads directory does not exist."
    exit 1
fi

file_name=$(ls -1 "$upload_dir" | head -n 1)

if [ -z "$file_name" ]; then
    echo "No files found in the uploads directory."
    exit 1
fi


file_path="$upload_dir/$file_name"
output_path="$upload_dir/output.txt"

npx jest $test_path $file_path --no-color 2> $output_path
