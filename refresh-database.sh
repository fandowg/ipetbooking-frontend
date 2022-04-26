set -e

cd ~/Homestead/

vagrant ssh

cd code/booking
php artisan dddream:install

cd -